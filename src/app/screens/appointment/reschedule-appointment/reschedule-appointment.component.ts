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
import { PaginatedDataSource } from "app/paging/paginated-datasource";
import { Sort } from "app/paging/page";
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from "@angular/animations";
import { Validators, AbstractControl } from "@angular/forms";
import { FormControl } from "@angular/forms";
import { MatSelect } from "@angular/material/select";
import { MatOption } from "@angular/material/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { trim } from "jquery";
import { Overlay } from "@angular/cdk/overlay";
import {
  AppointmentByIdQuery,
  Sensez9Service,
} from "app/sensez9/sensez9.service";
import { Appointment } from "app/screens/models/appointment";
import { AddUpdateAppointmentComponent } from "../add-update-appointment/add-update-appointment.component";
import { EditMessageComponent } from "../edit-message/edit-message.component";

declare var $: any;

@Component({
  selector: "app-reschedule-appointment",
  templateUrl: "./reschedule-appointment.component.html",
  styleUrls: ["./reschedule-appointment.component.css"],
  animations: [
    trigger("detailExpand", [
      state("collapsed", style({ height: "0px", minHeight: "0" })),
      state("expanded", style({ height: "*" })),
      transition(
        "expanded <=> collapsed",
        animate("225ms cubic-bezier(0.4, 0.0, 0.2, 1)")
      ),
    ]),
  ],
})
export class RescheduleAppointmentComponent implements OnInit {
  appointmentData: PaginatedDataSource<Appointment, AppointmentByIdQuery>;
  initialSort: Sort<Appointment> = { property: "created_date", order: "desc" };

  displayedColumns: string[] = [
    "sr_no",
    "site_name",
    "tax_preparer_name",
    "meeting_type_name",
    "client_type_name",
    "appointment_date",
    "time_interval",
    "appointment_start_time",
    "client_email",
    "client_name",
    "client_phone_no",
    "client_address",
    "zip_code",
    "created_date",
    "action",
  ];

  rescheduleForm = this.formBuilder.group({
    search_key: ["", Validators.required],
  });

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

  allSiteResp: any;
  siteId: any;
  isShowTable: boolean;
  appointmentId: any;

  appointmentIdResp: Appointment;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private overlay: Overlay,
    public dialog: MatDialog,
    public sensez9Service: Sensez9Service
  ) {
    const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear - 1, 11, 4);
    this.maxDate = new Date();
  }

  ngOnInit(): void {
    let currentUser = JSON.parse(localStorage.getItem("currentUser"));

    this.loadSummary("init");
  }

  getAppointmentsBySearchKey() {
    this.sensez9Service
      .getAppointmentsBySearchKey(this.rescheduleForm.value)
      .subscribe((resp) => {
        if (resp.status == 200) {
          const respAppointmentSearchKey: Appointment[] = resp.body.obj;

          if (respAppointmentSearchKey != undefined) {
            if (respAppointmentSearchKey.length == 1) {
              this.openDialog(
                "edit_appointment",
                respAppointmentSearchKey[0],
                respAppointmentSearchKey[0].appointment_id
              );
            } else {
              this.isShowTable = true;
              this.appointmentData = new PaginatedDataSource<
                Appointment,
                AppointmentByIdQuery
              >(
                (request, query) =>
                  this.sensez9Service.page4(
                    request,
                    query,
                    respAppointmentSearchKey
                  ),
                this.initialSort,
                { search: "", data: undefined },
                10
              );
            }
          }
          // this.appointmentId = this.respAppointmentSearchKey
          //   ? this.respAppointmentSearchKey.appointment_id
          //   : 0;
          // this.getAppointmentByAppointmentId(this.appointmentId);
        }
      });
  }

  getAppointmentByAppointmentId(id) {
    let input = {
      appointment_id: id,
    };
    // this.sensez9Service.getAppointmentDetail(input).subscribe(
    //   (resp) => {
    //     this.appointmentIdResp = resp.body.obj;
    //     if(this.allSiteResp !== null){
    //       var appointmentList = resp.body.obj;
    //       this.appointmentData = new PaginatedDataSource<
    //       Appointment, AppointmentByIdQuery
    //       >(
    //         (request, query) =>
    //           this.sensez9Service.page4(request, query, appointmentList),
    //         this.initialSort,
    //         {  search: "",
    //         data:undefined
    //         },
    //         10
    //       );
    //     }
    //   },
    //   (err: HttpErrorResponse) => {
    //     console.log(err.message);
    //     if (err.error instanceof Error) {
    //       console.log(" An error occurred:", err.error.message);
    //     } else {
    //       // Backend returns unsuccessful response codes such as 404, 500 etc
    //       console.log("Rulelist Response body:", err.error);
    //     }
    //   }
    // );
  }

  openDialog(action: string, obj: any, element: any) {
    const dialogConfig = new MatDialogConfig();
    obj.action = action;
    obj.object_id = element;
    dialogConfig.backdropClass = "bdrop";
    dialogConfig.panelClass = "dialog-responsive";
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = obj;
    let dialogRef;

    if (action == "delete_appointment") {
      dialogRef = this.dialog.open(EditMessageComponent, dialogConfig);
    }

    if (action == "edit_appointment") {
      dialogRef = this.dialog.open(AddUpdateAppointmentComponent, dialogConfig);
    }

    dialogRef.afterClosed().subscribe((result) => {
      if (result.event === "edit_appointment" && result.isUpdated === true) {
        this.showNotification(
          "bottom",
          "right",
          "success",
          "Appointment updated successfully",
          "announcement"
        );
        // this.getAppointmentListById(this.centerId, this.zipCode);
      }
    });
  }
  showNotification(from, align, color, stringMessage, icons) {
    const type = ["", "info", "success", "warning", "danger"];

    $.notify(
      {
        icon: icons,
        message: stringMessage,
      },
      {
        type: type[color],
        timer: 4000,
        placement: {
          from: from,
          align: align,
        },
        template:
          '<div data-notify="container" class="col-xl-4 col-lg-4 col-11 col-sm-4 col-md-4 alert alert-{0} alert-with-icon" role="alert">' +
          '<button mat-button  type="button" aria-hidden="true" class="close mat-button" data-notify="dismiss">  <i class="material-icons">close</i></button>' +
          '<i class="material-icons" data-notify="icon">notifications</i> ' +
          '<span data-notify="title">{1}</span> ' +
          '<span data-notify="message">{2}</span>' +
          '<div class="progress" data-notify="progressbar">' +
          '<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
          "</div>" +
          '<a href="{3}" target="{4}" data-notify="url"></a>' +
          "</div>",
      }
    );
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.rescheduleForm.controls[controlName].hasError(errorName);
  };

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
}
