import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { HttpErrorResponse } from "@angular/common/http";
import { DomSanitizer } from "@angular/platform-browser";
import { MatIconRegistry } from "@angular/material/icon";
import { Chart } from "chart.js";
import "chartjs-plugin-zoom";
import { DatePipe } from "@angular/common";
import { MatDatepickerInputEvent } from "@angular/material/datepicker";
import { FormBuilder } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { MatTableDataSource } from "@angular/material/table";
import { BsesService, powerOutageSurveyQuery } from "app/bses-dashboard/bses.service";
import { DataPowerByOutages } from "app/bses-dashboard/devicesByOutageResponse";
import { PaginatedDataSource } from "app/paging/paginated-datasource";
import { Sort } from "app/paging/page";
import { trim } from "jquery";
import * as Chartist from "chartist";


@Component({
  selector: 'app-bses-report',
  templateUrl: './bses-report.component.html',
  styleUrls: ['./bses-report.component.css']
})
export class BsesReportComponent implements OnInit {
  displayedColumns = ['sr_no', 'date', 'device', 'location', 'alert_log', 'status', 'no_of_outages',
    'mins_of_outage', 'outage1', 'outage2', 'outage3'];

  initialSort: Sort<DataPowerByOutages> = { property: "date", order: "desc" };


  pipe = new DatePipe("en-US");

  today: number = Date.now();
  date: String;
  todate: String;
  now = Date.now();
  todayDate = this.pipe.transform(this.now, "yyyy-MM-dd", "en-US");
  minDate: any;
  maxDate: any;
  events: string[] = [];
  events1: string[] = [];
  datepick = true;
  grid = true;

  bsesDashboardForm = this.formBuilder.group({
    // select_ward: ["", Validators.required],
    // select_site: ["", Validators.required],
  })
  stickyColumns: string[] = ['Sr No', 'Date', 'Device', 'Location', 'Alert Log', 'Status'];

  allDevicesDrpDownResp: any;
  selectedDevice: number = 0;
  dailySummaryDataById: any
  devicesByOutageataResp: any;
  powerByOutageArray: any[];
  powerByOutageObj: any;
  isBarChart = false;
  isLineChart= true;
  barChartResp:any;

  public chart: any;
  lineChartResp: any;
  device_id: any;
  lineChart: any;
  deviceInfo: any;
  newDevicesByOutage: DataPowerByOutages[];

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    public bsesService: BsesService
  ) {
    const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear - 1, 11, 4);
    this.maxDate = new Date();
  }

  ngOnInit(): void {
    this.loadSummary("init");
  }

  loadSummary(flag: any) { 
    const now = this.today;
    const myFormattedDate = this.pipe.transform(now, "yyyy-MM-dd", "en-US");
    let currentUser = JSON.parse(localStorage.getItem("currentUser"));

    let input = {
      start_date: myFormattedDate + " 00:00:00",
      end_date: myFormattedDate + " 23:59:59",
    };
   
    let date = new Date();
    let firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    let  lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    let name=this.pipe.transform(firstDay, "MMMM yy", "en-US");
    let start = this.pipe.transform(firstDay, "yyyy-MM-dd", "en-US");
    let end = this.pipe.transform(lastDay, "yyyy-MM-dd", "en-US");
    
    let chartInput = {
      start_date : start + " 00:00:00",
      end_date : end + " 23:59:59",
      device_id : this.selectedDevice
    }
    this.getAllDevices(input);


    if(this.selectedDevice !== 0){
      // this.getAllDevices(input);
      this.getDailyLineChart(chartInput)
    }

  }
  isButtonVisible = false;

  prev() {
    this.today = new Date(this.today - 24 * 60 * 60 * 1000).getTime();
    this.loadSummary("prev");
    this.isButtonVisible = true;
  }

  next() {
    this.today = new Date(this.today + 24 * 60 * 60 * 1000).getTime();
    this.loadSummary("next");
    if (this.today == this.now) {
      this.isButtonVisible = false;
    }
  }

  addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
    this.events.push(`${type}: ${event.value}`);
    if (type === "change") {
      console.log("change event value : ", event.value);
      this.today = event.value.getTime();

      // this.loadSummary();
      this.loadSummary("next");
      if (this.today == this.now) {
        this.isButtonVisible = false;
      } else {
        this.isButtonVisible = true;
      }
    }
  }

  selectDevices(device_name, device_id,devices, event) {
    console.log(device_name, device_id, event);
    this.selectedDevice = device_id;
    this.device_id = device_id;
    this.deviceInfo = devices;

    const now = this.today;
    const myFormattedDate = this.pipe.transform(now, "yyyy-MM-dd", "en-US");

    let input = {
      start_date: myFormattedDate + " 00:00:00",
      end_date: myFormattedDate + " 23:59:59",
      device_id: device_id
    };

    let date = new Date();
    let firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    let  lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    let name=this.pipe.transform(firstDay, "MMMM yy", "en-US");
    let start = this.pipe.transform(firstDay, "yyyy-MM-dd", "en-US");
    let end = this.pipe.transform(lastDay, "yyyy-MM-dd", "en-US");
    
    let chartInput = {
      start_date : start + " 00:00:00",
      end_date : end + " 23:59:59",
      device_id : this.selectedDevice
    }

    if(this.selectedDevice !== 0){
      this.getDailySummaryDataMonthlyByDeviceId(input);
      this.getDevicesDetailByOutages(input);
        this.getDailyLineChart(chartInput)
    }
    // this.getBarChart(chartInput)
    
  }

  getAllDevices(input) {
    this.bsesService.getAllDevices(input).subscribe(resp => {
      this.allDevicesDrpDownResp = resp.body.obj;

    }, (err: HttpErrorResponse) => {
      console.log(err.message);
      if (err.error instanceof Error) {
        // console.log(" An error occurred:", err.error.message);
      } else {
        // Backend returns unsuccessful response codes such as 404, 500 etc
        // console.log("Rulelist Response body:", err.error);
      }
    })
  }


  getDailySummaryDataMonthlyByDeviceId(input) {
    this.bsesService.getDailySummaryDataMonthlyByDeviceId(input).subscribe(resp => {
      this.dailySummaryDataById = resp.body.obj;


    }, (err: HttpErrorResponse) => {
      console.log(err.message);
      if (err.error instanceof Error) {
        // console.log(" An error occurred:", err.error.message);
      } else {
        // Backend returns unsuccessful response codes such as 404, 500 etc
        // console.log("Rulelist Response body:", err.error);
      }
    })
  }

  getDevicesDetailByOutages(input: any) {
    this.bsesService.getDevicesDetailByOutages(input).subscribe(resp => {
      this.devicesByOutageataResp = resp.body.obj;
      this.newDevicesByOutage = resp.body.obj;
      if (this.devicesByOutageataResp !== null) {
        let i = 0;


        this.powerByOutageArray = [];
        this.displayedColumns = [];

        this.displayedColumns.push('Sr No');
        this.displayedColumns.push('Date');
        this.displayedColumns.push('Device');
        this.displayedColumns.push('Location');
        this.displayedColumns.push('Alert Log');
        this.displayedColumns.push('Status');
        this.displayedColumns.push('No Of Outages');
        this.displayedColumns.push('Mins Of Outages');
        // this.displayedColumns.push('Outage 1');
        // this.displayedColumns.push('Outage 2');
        // this.displayedColumns.push('Outage 3');

        this.devicesByOutageataResp.forEach(element => {
          this.powerByOutageObj = {};

          this.powerByOutageObj['Sr No'] = i + 1;
          this.powerByOutageObj['Date'] = this.pipe.transform(element.date, "yyyy-MM-dd", "en-US");
          this.powerByOutageObj['Device'] = element.device_name;
          this.powerByOutageObj['Location'] = element.location;
          this.powerByOutageObj['Alert Log'] = element.alerts_recipents;
          this.powerByOutageObj['Status'] = element.status;
          this.powerByOutageObj['No Of Outages'] = element.total_outrages;
          this.powerByOutageObj['Mins Of Outages'] = element.total_mins_outrages;
          // this.powerByOutageObj['Outage 1'] = " ";
          // this.powerByOutageObj['Outage 2'] = " ";     
          // this.powerByOutageObj['Outage 3'] = " ";

          let j = 0;
          element.outrages.forEach(element1 => {
            let incr = j + 1;
            if (this.displayedColumns.includes('Outages' + ' ' + incr) == false) {
              this.displayedColumns.push('Outages' + ' ' + incr);

            }
            j++;
            this.powerByOutageObj['Outages' + ' ' + incr] = this.pipe.transform(element1.failure_time, "HH-mm a", "en-US") + ' ' + this.pipe.transform(element1.restore_time, "HH-mm a", "en-US");



          });

          this.powerByOutageArray.push(this.powerByOutageObj);
          i++;
        });

        console.log('powerByOutageArray', this.powerByOutageArray);
        console.log('displayedCol', this.displayedColumns);
        this.devicesByOutageataResp = new PaginatedDataSource<any, powerOutageSurveyQuery>(
          (request, query) =>
            this.bsesService.PowerByOutagePage(request, query, this.powerByOutageArray),
          this.initialSort,
          { search: "", data: undefined },
          5
        );
        this.devicesByOutageataResp.pageSize = 3;
        console.log('devicesByOutageataResp', this.devicesByOutageataResp)
      }

    },
      (err: HttpErrorResponse) => {
        console.log(err.message);
        if (err.error instanceof Error) {
          // console.log(" An error occurred:", err.error.message);
        } else {
          // Backend returns unsuccessful response codes such as 404, 500 etc
          // console.log("Rulelist Response body:", err.error);
        }
      })
  }

  clickBarChart(){
    this.isLineChart = false;
    this.isBarChart = true;
    
    let date = new Date();
    let firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    let  lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    let name=this.pipe.transform(firstDay, "MMMM yy", "en-US");
    let start = this.pipe.transform(firstDay, "yyyy-MM-dd", "en-US");
    let end = this.pipe.transform(lastDay, "yyyy-MM-dd", "en-US");
    
    let chartInput = {
      start_date : start + " 00:00:00",
      end_date : end + " 23:59:59",
      device_id : this.device_id
    }

    this.getBarChart(chartInput);
  }

  getLineChart(){
    this.isLineChart = true;
    this.isBarChart = false;
    
    let date = new Date();
    let firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    let  lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    let name=this.pipe.transform(firstDay, "MMMM yy", "en-US");
    let start = this.pipe.transform(firstDay, "yyyy-MM-dd", "en-US");
    let end = this.pipe.transform(lastDay, "yyyy-MM-dd", "en-US");
    
    let chartInput = {
      start_date : start + " 00:00:00",
      end_date : end + " 23:59:59",
      device_id : this.device_id
    }

    this.getDailyLineChart(chartInput);
  }


  getDailyLineChart(input){
    let date = new Date();
    let firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    let  lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    let name=this.pipe.transform(firstDay, "MMMM yy", "en-US");

    this.bsesService.getDailyLineChart(input).subscribe(resp => {
      this.lineChartResp = resp.body.obj;

      let lineDataPoints = [];
      let lineDataLabels = [];
      this.lineChartResp.forEach(element => {
        lineDataPoints.push(element.mins);
        lineDataLabels.push(this.pipe.transform(element.created_at, "yyyy-MM-dd", "en-US"))
      });

      if (this.lineChart != undefined) {
        this.lineChart.destroy();
      }
   

      this.lineChart = new Chart("canvasLine", {
        type: "line",
        data: {
          labels: lineDataLabels,
          label:"",
          datasets: [
            {
              data: lineDataPoints,
              label: this.deviceInfo.device_name + ' ' + this.deviceInfo.locations + ' ' + 'No. of Outages ' + name, 
              borderColor: "#a4dce3",
              backgroundColor:"#a4dce3",
              pointBackgroundColor: "#e86667",
              pointRadius:3.5,
              pointBorderColor : "#e86667",
              fill:false,
              
              // backgroundColor: "rgba(148,159,177,0.2)",
            },
          ],
        },
        options: {
          responsive: true,
          legend: {
            display: true,
          },
          scales: {
            xAxes: [
              {
                display: true,
              //  title: "date",
              scaleLabel: {
                display: true,
                labelString: ''
              },
              },
              
            ],
            yAxes: [
              {
                display: true,
                ticks: {
                  suggestedMin: 0,
                  suggestedMax: 30,
                },
                scaleLabel: {
                  display: true,
                  labelString: ''
                },
              },
            ],
          },
          tooltips: {
            callbacks: {
              label: function(tooltipItem, data) {
                  
                  return  "Total Min of outage: " + tooltipItem.yLabel ;
              },
              title: function(tooltipItem, data) {
                 return "";
                },
              
            }  
          }
        },
      });
      this.startAnimationForLineChart1(this.lineChart)
    })
  }

  startAnimationForLineChart1(chart) {
    let seq: any, delays: any, durations: any;
    seq = 0;
    delays = 0;
    durations = 0;

    chart.on("draw", function (data) {
      if (data.type === "line" || data.type === "area") {
        data.element.animate({
          d: {
            begin: 0,
            dur: 0,
            from: data.path
              .clone()
              .scale(1, 0)
              .translate(0, data.chartRect.height())
              .stringify(),
            to: data.path.clone().stringify(),
            easing: Chartist.Svg.Easing.easeOutQuint,
          },
        });
      } else if (data.type === "point") {
        seq++;
        data.element.animate({
          opacity: {
            begin: seq * delays,
            dur: durations,
            from: 0,
            to: 1,
            easing: "ease",
          },
        });
      }
    });

    seq = 0;
  }


  getBarChart(input){
    
    this.bsesService.getDailyBarChart(input).subscribe(resp => {
      this.barChartResp = resp.body.obj; 
      let barDataPoints = [];
      let barDataLabels = [];
      this.barChartResp.forEach(element => {
        barDataPoints.push(element.mins);
        // barDataPoints.push(this.pipe.transform(element.mins, "mm ", "en-US"));
        barDataLabels.push(this.pipe.transform(element.created_at, "yyyy-MM-dd", "en-US"))
      });
      console.log(barDataPoints, barDataLabels )

      if (this.chart != undefined) {
        this.chart.destroy();
      }

      this.chart = new Chart("canvas", {
        type: "bar",
        data: {
          labels: barDataLabels,
          datasets: [
            {
              label: "Total Mins Of Outage",
              data: barDataPoints,
              backgroundColor: '#e86667', 
              borderColor:  '#e86667',
              borderWidth: 1,
              barThickness: 60,

            }
          ]
        },
        options: {
        
          scales: {
            xAxes: [{
              gridLines: {
                  color: "rgba(0, 0, 0, 0)",
              }
          }],
            yAxes: [
                {
                  
                  display: true,
                  ticks: {
                    suggestedMin: 0,
                    suggestedMax:100,
                    stepSize:20,
                  },
                  scaleLabel: {
                    labelString: 'Total Minutes Of Outage',
                    display: true
                  }
                },
              
            ]
          }
        }
      });
    })

  
   
    
 

  }
  

  isSticky(columnName: string) {

    const columnIndex = this.stickyColumns.indexOf(trim(columnName));

    if (columnIndex != -1) {
      return true;
    } else {
      return false;
    }
  }

  results1(){
    let i = 0;
    
    let newpowerByOutageArray = [];
    let newdisplayedColumns = [];
  
   newdisplayedColumns.push('Sr No');
   newdisplayedColumns.push('Date');
   newdisplayedColumns.push('Device');
   newdisplayedColumns.push('Location');
   newdisplayedColumns.push('Alert Log');
   newdisplayedColumns.push('Status');
   newdisplayedColumns.push('No Of Outages');
   newdisplayedColumns.push('Mins Of Outages');
  
    this.newDevicesByOutage.forEach(element => {
      let newpowerByOutageObj = {};
      newpowerByOutageObj['Sr No'] = i + 1;
      newpowerByOutageObj['Date'] = this.pipe.transform(element.date, "yyyy-MM-dd", "en-US");
      newpowerByOutageObj['Device'] = element.device_name;
      newpowerByOutageObj['Location'] = element.location;
      newpowerByOutageObj['Alert Log'] = element.alerts_recipents.replace(/,/g, ' ');
      newpowerByOutageObj['Status'] = element.status;
      newpowerByOutageObj['No Of Outages'] = element.total_outrages;
      newpowerByOutageObj['Mins Of Outages'] = element.total_mins_outrages;
      let j = 0;
      element.outrages.forEach(element1 => {
        let incr = j + 1;
        if(newdisplayedColumns.includes('Outages'+' ' +incr) == false) {
          newdisplayedColumns.push('Outages'+' ' +incr); 
        }
        j++;
          newpowerByOutageObj['Outages'+' ' +incr] =  this.pipe.transform(element1.failure_time, "HH-mm a", "en-US") + ' ' + this.pipe.transform(element1.restore_time, "HH-mm a", "en-US");
      });
      newpowerByOutageArray.push(newpowerByOutageObj);
      i++;
   }
    )
  
    this.downloadFile(
      newpowerByOutageArray,
      'Power Status Summary Report' + ' ' + this.todayDate,
     newdisplayedColumns
    );
  }

  results() {
    console.log(this.powerByOutageObj, this.displayedColumns)
    this.downloadFile(
      this.powerByOutageArray,
      'Power Outage Details Report' + ' ' + this.todayDate,
      this.displayedColumns
    );
  }



  downloadFile(data, filename = "data", headers) {
    let csvData = this.ConvertToCSV(data, headers);
    console.log(csvData);
    let blob = new Blob(["\ufeff" + csvData], {
      type: "text/csv;charset=utf-8;",
    });
    let dwldLink = document.createElement("a");
    let url = URL.createObjectURL(blob);
    let isSafariBrowser =
      navigator.userAgent.indexOf("Safari") != -1 &&
      navigator.userAgent.indexOf("Chrome") == -1;
    if (isSafariBrowser) {
      //if Safari open in new window to save file with random filename.
      dwldLink.setAttribute("target", "_blank");
    }
    dwldLink.setAttribute("href", url);
    dwldLink.setAttribute("download", filename + ".csv");
    dwldLink.style.visibility = "hidden";
    document.body.appendChild(dwldLink);
    dwldLink.click();
    document.body.removeChild(dwldLink);
  }

  ConvertToCSV(objArray, headerList) {
    let array = typeof objArray != "object" ? JSON.parse(objArray) : objArray;
    console.log(array);
    let str = "";
    let row = "";
    // let row = "S.No,";
    var i: number = 0;
    for (let index in headerList) {
      if (i == 0) {
        row = headerList[index] + ",";
      } else {

        row += headerList[index] + ",";
      }

      i = i + 1;
    }
    row = row.slice(0, -1);
    str += row + "\r\n";

    for (let i = 0; i < array.length; i++) {
      let j: number = 0;
      let line: string = "";
      for (let index in headerList) {
        let head = headerList[index];
        console.log(head)
        console.log(array[i]);
        if (j == 0) {
          line = array[i][head];
        } else {
          line += "," + array[i][head];
        }
        console.log(line);
        j = j + 1;
      }
      str += line + "\r\n";
    }
    return str;
  }

}
