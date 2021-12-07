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
import { PaginatedDataSource } from 'app/paging/paginated-datasource';
import { Sort } from 'app/paging/page';
import { animate, state, style, transition, trigger } from "@angular/animations";

import { allDataOutageSurveyQuery, BsesService, powerOutageSurveyQuery } from "./bses.service";
import { DataPowerByOutages, DevicesByOutageResponse } from "./devicesByOutageResponse";
import { trim } from "jquery";
import { Overlay } from "@angular/cdk/overlay";
import { DashboardTableComponent } from "./dashboard-table/dashboard-table.component";
import { LineChartComponent } from "./line-chart/line-chart.component";
import { BarChartComponent } from "./bar-chart/bar-chart.component";
import { AllDevicesData } from "./allDeviceOutagesResponse";



@Component({
  selector: 'app-bses-dashboard',
  templateUrl: './bses-dashboard.component.html',
  styleUrls: ['./bses-dashboard.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class BsesDashboardComponent implements OnInit {

  displayedColumns = ['Sr No', 'Date', 'Device', 'Location','Alert Log','Status','No Of Outages',
                    'Mins Of Outage'];
  
  stickyColumns: string[] = ['Sr No', 'Date', 'Device', 'Location','Alert Log','Status'];

  public alldata1: PaginatedDataSource<DevicesByOutageResponse, powerOutageSurveyQuery>;

  initialSort: Sort<DataPowerByOutages> = { property: "date", order: "desc" };
       
  initialSort1: Sort<AllDevicesData> = { property: "device_name", order: "desc" };

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
   
  });
  bsesSummaryDataResp: any;
  devicesByOutageataResp: any;
  allDevicesDataResp: any;
  allDevicesDataByOutageResp: any;
  
  selectedDevice: 'All';
  powerByOutageArray: any[];
  powerByOutageObj: {};

  public chart: Chart;
  newDevicesByOutage: DataPowerByOutages[];
  allDeviceOutage: AllDevicesData[];


  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private overlay: Overlay,
    public dialog: MatDialog,
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
    
    let summaryInput = {
      start_date: myFormattedDate + " 00:00:00",
      end_date: myFormattedDate + " 23:59:59",
    };
    this.getSummaryData(summaryInput);
    this.getDevicesDetailByOutages(summaryInput);
    this.getAllDevicesDataByOutages(summaryInput);
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

  selectDevices(event){
    this.selectedDevice = event.value;
    console.log(event);
  }

  getSummaryData(input:any){
    
    this.bsesService.getSummaryData(input).subscribe(resp => {
      this.bsesSummaryDataResp = resp.body.obj;
    },
    (err: HttpErrorResponse) => {
      console.log(err.message);
      if (err.error instanceof Error) {
        console.log(" An error occurred:", err.error.message);
      } else {
        // Backend returns unsuccessful response codes such as 404, 500 etc
        console.log("Rulelist Response body:", err.error);
      }
    })
  }

  getAllDevicesDataByOutages(input:any){
    
    this.bsesService.getAllDevicesDataByOutages(input).subscribe(resp => {
      this.allDevicesDataByOutageResp = resp.body.obj;
      this.allDeviceOutage = resp.body.obj;
      if(this.allDevicesDataByOutageResp !== null){
        this.allDevicesDataByOutageResp.forEach(element => {
          if(element.status == 0) {
            element.color_code = "#82c568";
          } else if(element.status == 1) {
            element.color_code = "#e86667";
          }
  
        });

        this.allDevicesDataByOutageResp = new PaginatedDataSource<any, allDataOutageSurveyQuery>(
          (request, query) =>
            this.bsesService.AllDataOutagePage(request, query, this.allDeviceOutage),
          this.initialSort1,
          { search: "", data: undefined },
          5
        );
        this.allDevicesDataByOutageResp.pageSize = 3;
      }
     
    },
    (err: HttpErrorResponse) => {
      console.log(err.message);
      if (err.error instanceof Error) {
        console.log(" An error occurred:", err.error.message);
      } else {
        // Backend returns unsuccessful response codes such as 404, 500 etc
        console.log("Rulelist Response body:", err.error);
      }
    })
  }

  getDevicesDetailByOutages(input:any){
    this.bsesService.getDevicesDetailByOutages(input).subscribe(resp => {
      this.devicesByOutageataResp = resp.body.obj;
      this.newDevicesByOutage = resp.body.obj;
      if(this.devicesByOutageataResp !== null){
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
            if(this.displayedColumns.includes('Outages'+' ' +incr) == false) {
              this.displayedColumns.push('Outages'+' ' +incr);
              
            }
            j++;
              this.powerByOutageObj['Outages'+' ' +incr] =  this.pipe.transform(element1.failure_time, "HH-mm a", "en-US") + ' ' + this.pipe.transform(element1.restore_time, "HH-mm a", "en-US");
            
        
  
          });
        
          this.powerByOutageArray.push(this.powerByOutageObj);
          i++;
        });
  
        console.log('powerByOutageArray',this.powerByOutageArray);
        console.log('displayedCol',this.displayedColumns);
        this.devicesByOutageataResp = new PaginatedDataSource<any, powerOutageSurveyQuery>(
          (request, query) =>
            this.bsesService.PowerByOutagePage(request, query, this.powerByOutageArray),
          this.initialSort,
          { search: "", data: undefined },
          5
        );
        this.devicesByOutageataResp.pageSize = 3;
        console.log('devicesByOutageataResp',this.devicesByOutageataResp)
      }
      
    },
    (err: HttpErrorResponse) => {
      console.log(err.message);
      if (err.error instanceof Error) {
        console.log(" An error occurred:", err.error.message);
      } else {
        // Backend returns unsuccessful response codes such as 404, 500 etc
        console.log("Rulelist Response body:", err.error);
      }
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
    'Power Outage Details Report' + ' ' + this.todayDate,
   newdisplayedColumns
  );
}


  results() {
    console.log( this.powerByOutageObj,this.displayedColumns)
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

  

  openDialog(action: any, obj: any, element: any) {
    const now = this.today;
    const myFormattedDate = this.pipe.transform(now, "yyyy-MM-dd", "en-US");
    

    const dialogConfig = new MatDialogConfig();
    const scrollStrategy = this.overlay.scrollStrategies.reposition();
    obj.action = action;
    obj.device_id = element.device_id;
    obj = element;
     
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = obj;
    dialogConfig.data.start_date = myFormattedDate + " 00:00:00";
    dialogConfig.data.end_date = myFormattedDate + " 23:59:59"; 
    dialogConfig.scrollStrategy = scrollStrategy;
 
    // dialogConfig.height = '600px';

    let dialogRef;
    if (action === "dashboard") {
      dialogRef = this.dialog.open(DashboardTableComponent, dialogConfig);
    }
    if (action === "graph") {
      dialogRef = this.dialog.open(BarChartComponent, dialogConfig);
    }
    
   
    // if (action === "Reporttable") {
    //   dialogRef = this.dialog.open(ReportdatatableComponent, dialogConfig);
    //   dialogConfig.width = '512px';
    // }

    dialogRef.afterClosed().subscribe((result) => {
      // alert('response: ' + result)
      if (result.event === "Add" && result.isUpdated === true) {
        //  this.getDeviceList();
        this.showNotification(
          "bottom",
          "right",
          "success",
          "device added successful",
          "announcement"
        );
      }

      if (result.event === "Edit" && result.isUpdated === true) {
        //  this.getDeviceList();
        this.showNotification(
          "bottom",
          "right",
          "success",
          "Device edit successful",
          "announcement"
        );
      }
      if (result.event === "Graph" && result.isUpdated === true) {
        //  this.getDeviceList();
        this.showNotification(
          "bottom",
          "right",
          "success",
          "Device deleted successful",
          "announcement"
        );
      }
    });
  }

  showNotification(from, align, color, stringMessage, icons) {
    const type = ["", "info", "success", "warning", "danger"];

    // $.notify(
    //   {
    //     icon: icons,
    //     message: stringMessage,
    //   },
    //   {
    //     type: type[color],
    //     timer: 4000,
    //     placement: {
    //       from: from,
    //       align: align,
    //     },
    //     template:
    //       '<div data-notify="container" class="col-xl-4 col-lg-4 col-11 col-sm-4 col-md-4 alert alert-{0} alert-with-icon" role="alert">' +
    //       '<button mat-button  type="button" aria-hidden="true" class="close mat-button" data-notify="dismiss">  <i class="material-icons">close</i></button>' +
    //       '<i class="material-icons" data-notify="icon">notifications</i> ' +
    //       '<span data-notify="title">{1}</span> ' +
    //       '<span data-notify="message">{2}</span>' +
    //       '<div class="progress" data-notify="progressbar">' +
    //       '<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
    //       "</div>" +
    //       '<a href="{3}" target="{4}" data-notify="url"></a>' +
    //       "</div>",
    //   }
    // );
  }

}
