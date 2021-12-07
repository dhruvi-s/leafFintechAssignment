import { DatePipe } from "@angular/common";
import { HttpErrorResponse } from "@angular/common/http";
import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, Validators, AbstractControl } from "@angular/forms";
import { MatDatepickerInputEvent } from "@angular/material/datepicker";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { Sort } from "app/paging/page";
import { PaginatedDataSource } from "app/paging/paginated-datasource";
import { trim } from "jquery";
import { BsesService, powerOutageSurveyQuery } from "../bses.service";
import { DataPowerByOutages, DevicesByOutageResponse } from "../devicesByOutageResponse";

@Component({
  selector: 'app-dashboard-table',
  templateUrl: './dashboard-table.component.html',
  styleUrls: ['./dashboard-table.component.css']
})
export class DashboardTableComponent implements OnInit {
  displayedColumns = ['Sr No', 'Date', 'Device', 'Location','Alert Log','Status','No Of Outages',
  'Mins Of Outage'];

stickyColumns: string[] = ['Sr No', 'Date', 'Device', 'Location','Alert Log','Status'];

public alldata1: PaginatedDataSource<DevicesByOutageResponse, powerOutageSurveyQuery>;

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
  dashboardTable: any;
  devicesByOutageataResp: any;
  powerByOutageArray: any[];
  powerByOutageObj: {};
  selectedMonth: any;

  constructor(
    public dialogRef: MatDialogRef<DashboardTableComponent>,
    private formBuilder: FormBuilder,
    public bsesService: BsesService,

    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear - 1, 11, 4);
    this.maxDate = new Date();

    this.dashboardTable = data;
    this.selectedMonth = this.pipe.transform(this.dashboardTable.start_date, "yyyy-MM-dd", "en-US");

  }

  ngOnInit(): void {
    this.loadSummary("init");
  }

  isSticky(columnName: string) {

    const columnIndex = this.stickyColumns.indexOf(trim(columnName));

    if (columnIndex != -1) {
      return true;
    } else {
      return false;
    }
  }


  getDevicesDetailByOutages(input:any){
    this.bsesService.getDevicesDetailByOutages(input).subscribe(resp => {
      this.devicesByOutageataResp = resp.body.obj;

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
  
          let j = 0;
          element.outrages.forEach(element1 => {
            let incr = j + 1;
            if(this.displayedColumns.includes('Outages'+' ' +incr) == false) {
              this.displayedColumns.push('Outages'+' ' +incr);  
            }
            j++;
              this.powerByOutageObj['Outages'+' ' +incr] =  this.pipe.transform(element1.failure_time, "HH-mm a", "en-US") + ' - ' + this.pipe.transform(element1.restore_time, "HH-mm a", "en-US");
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

  loadSummary(flag: any) {
    // const now = this.today;
    // const myFormattedDate = this.pipe.transform(now, "yyyy-MM-dd", "en-US");
    // let currentUser = JSON.parse(localStorage.getItem("currentUser"));  
    
    let input = {
      start_date: this.dashboardTable.start_date,
      end_date: this.dashboardTable.end_date,
      device_id : this.dashboardTable.device_id
    };

    this.getDevicesDetailByOutages(input);
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
}
