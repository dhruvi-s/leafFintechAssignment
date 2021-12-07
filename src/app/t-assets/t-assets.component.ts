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

import { trim } from "jquery";
import { Overlay } from "@angular/cdk/overlay";
import { AddAssetsComponent } from "./add-assets/add-assets.component";


@Component({
  selector: 'app-t-assets',
  templateUrl: './t-assets.component.html',
  styleUrls: ['./t-assets.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class TAssetsComponent implements OnInit {

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

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private overlay: Overlay,
    public dialog: MatDialog,
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
      dialogRef = this.dialog.open(AddAssetsComponent, dialogConfig);
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
