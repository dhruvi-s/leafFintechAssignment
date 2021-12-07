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
import {  Validators, AbstractControl } from "@angular/forms";
import { FormControl } from "@angular/forms";
import { MatSelect } from "@angular/material/select";
import { MatOption } from "@angular/material/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { trim } from "jquery";
import { Overlay } from "@angular/cdk/overlay";
import { Sensez9Service, SiteQuery, UsersQuery } from "../sensez9.service";
import { AddUpdateSiteComponent } from "./add-update-site/add-update-site.component";
import { DataSite } from "./SiteResponse";

@Component({
  selector: 'app-site',
  templateUrl: './site.component.html',
  styleUrls: ['./site.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class SiteComponent implements OnInit {

  siteData: PaginatedDataSource<DataSite, SiteQuery>;
  initialSort: Sort<DataSite> = { property: "created_date", order: "desc" };

  displayedColumns: string[] = [
    'sr_no',
    'site_name',
    'zip_code',
    'address',
    'created_date',
    'action'
  ];

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



  longitude: number;
  latitude: number;

  dialog: any;
  allSiteResp: any;
  siteId: any;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private overlay: Overlay,     
    public sensez9Service: Sensez9Service,
  ) { 
    const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear - 1, 11, 4);
    this.maxDate = new Date();
  }

  ngOnInit(): void {
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    this.loadSummary("init");
    this.getSite();
  }
  
  getSite() {
    this.sensez9Service.getSite().subscribe(
      (resp) => {
        this.allSiteResp = resp.obj;
        if(this.allSiteResp !== null){
          var siteList = resp.obj;
          this.siteData = new PaginatedDataSource<
          DataSite, 
          SiteQuery
          >(
            (request, query) =>
              this.sensez9Service.page2(request, query, siteList),
            this.initialSort,
            {  search: "",
            data:undefined
            },
            10
          );
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
      }
    );
  }

  openModal(id) {
    this.siteId = id;
    const buttonModal = document.getElementById("openModalButton");
    console.log("buttonModal", buttonModal);
    buttonModal.click();
  }

  deleteSite (){
    let input = {
      user_id : this.siteId
    }
    this.sensez9Service.deleteSite(input).subscribe(resp => {
      if(resp.status == 200){
        this.getSite();
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
    }
  )
  }

  updateSite(data){
    data.update = true;
    this.router.navigate(['/addupdateSite', data]);
  }

  loadSummary(flag: any) {
    const now = this.today;
    const myFormattedDate = this.pipe.transform(now, "yyyy-MM-dd", "en-US");
    let currentUser = JSON.parse(localStorage.getItem("currentUser"));  
    
    let summaryInput = {
      start_date: myFormattedDate + " 00:00:00",
      end_date: myFormattedDate + " 23:59:59",
    };
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

  results() { 
    var displayedCol = []
    displayedCol.push('Site Name');
    displayedCol.push('ZipCode');
    displayedCol.push('Created Date');
  var tableObj = this.allSiteResp;
    tableObj.forEach(element => {
      element['Site Name'] = element.username;
      element['ZipCode'] = element.zip_code;
      element['Added On'] = element.created_date;
    });
    this.downloadFile(
      tableObj,
      'Site Report' + ' ' + this.todayDate,
      displayedCol
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
  let str = "";
  let row = "Sr.No,";

  for (let index in headerList) {
    row += headerList[index] + ",";
  }
  row = row.slice(0, -1);
  str += row + "\r\n";
  for (let i = 0; i < array.length; i++) {
    let line = i + 1 + "";
    for (let index in headerList) {
      let head = headerList[index];

      line += "," + array[i][head];
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
     
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = obj;
    dialogConfig.data.start_date = myFormattedDate + " 00:00:00";
    dialogConfig.data.end_date = myFormattedDate + " 23:59:59"; 
    dialogConfig.scrollStrategy = scrollStrategy;
 
    // dialogConfig.height = '600px';
    // dialogConfig.width = '300px';

    let dialogRef;
    if (action === "add") {
      dialogRef = this.dialog.open(AddUpdateSiteComponent, dialogConfig);
    }
  

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
