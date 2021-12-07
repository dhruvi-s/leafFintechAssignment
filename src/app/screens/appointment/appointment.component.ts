import { AddUpdateAppointmentComponent } from "./add-update-appointment/add-update-appointment.component";
import { ZipcodeResponse } from "app/screens/models/zipcode";
import { DatePipe } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewEncapsulation,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import {
  CalendarDayViewBeforeRenderEvent,
  CalendarEvent,
  CalendarEventAction,
  CalendarMonthViewBeforeRenderEvent,
  CalendarMonthViewDay,
  CalendarView,
  CalendarWeekViewBeforeRenderEvent,
} from "angular-calendar";
import { Sensez9Service, SummaryQuery } from "app/sensez9/sensez9.service";
import { isSameDay, isSameMinute, isSameMonth } from "date-fns";
import { Subject } from "rxjs";
import { HttpErrorResponse } from "@angular/common/http";
import { Appointment, AppointmentListResponse } from "../models/appointment";
import {
  ScheduleTaxpreparerResponse,
  ScheduleTaxpreparer,
} from "../models/schedule-taxprepare";
import { Zipcode } from "../models/zipcode";
import { Center, CenterResponse } from "../models/center";
import { TaxType, TaxTypeResponse } from "../models/TaxType";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import {
  DataTax,
  TaxResponse,
} from "app/sensez9/taxpreparer/TaxPreparerResponse";
import { element } from "protractor";
import {
  DataSummary,
  SummaryResponse,
} from "app/sensez9/summary/SummaryResponse";
import { PaginatedDataSource } from "app/paging/paginated-datasource";
import { Sort } from "app/paging/page";
import { EditMessageComponent } from "./edit-message/edit-message.component";
import { TaxScreeningMessageComponent } from "../tax-screening-message/tax-screening-message.component";
import { LoginUserInterface } from "../models/login-user";
import { DayFull, DayFullResponse } from "../models/day-full";
import { NormalResponse } from "../models/normal-response";
import { BlockUI, NgBlockUI } from "ng-block-ui";
import { BlockTemplateComponent } from "app/widgets/block-template/block-template.component";
import {
  AppointmentSummaryForTaxPreparers,
  AppointmentSummaryForTaxPreparersResponse,
} from "../models/appointment-summary-for-tax-preparers";

declare var $: any;
interface EventGroupMeta {
  type: string;
}
@Component({
  selector: "app-appointment",
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: "./appointment.component.html",
  styleUrls: ["./appointment.component.scss"],
})
export class AppointmentComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  blockTemplate: BlockTemplateComponent;
  summaryData: PaginatedDataSource<DataSummary, SummaryQuery>;
  initialSort: Sort<DataSummary> = {
    property: "total_hours_available",
    order: "desc",
  };

  centerList: Center[];
  taxTypeList: TaxType[];

  view: CalendarView = CalendarView.Month;
  refresh: Subject<any> = new Subject();
  CalendarView = CalendarView;
  activeDayIsOpen: boolean = false;
  viewDate: Date = new Date();
  datePipe = new DatePipe("en-US");
  displayedColumns: string[] = [
    "sr_no",
    "total_appointments",
    "tax_preparer_count",
    "document_drop_off_count",
    "basic_in_person_count",
    "advance_in_person_count",
    "return_visit_count",
    "total_hours",
    "total_hours_booked",
    "booking_percentage",
    "total_hours_available",
  ];
  isAdmin: boolean;
  allSitesResp: any;
  allTaxTypesResp: any;
  allSummaryResp: any;

  myColor = {
    white: "#ffffff",
    // black: "#000000 ",
    light_gray: "#F5F5F5",
    light_green: "#95f985",
    light_yellow: "#f6eabe",
  };
  modalData: {
    action: string;
    event: CalendarEvent;
  };
  eventList: ScheduleTaxpreparer[] = [];
  events: CalendarEvent[] = [];
  appointmentList: Appointment[] = [];
  groupedSimilarEvents: CalendarEvent[] = [];
  actions: CalendarEventAction[] = [
    {
      label:
        '<i class="material-icons anchor-icon" style="color:#000000;">edit</i>',
      a11yLabel: "Edit",
      onClick: ({ event }: { event: CalendarEvent }): void => {
        // this.handleEvent("Edited", event);

        this.openDialog("edit_appointment", event, event.id);
        // this.openDialog("edit_appointment_popup", event, event.id);
      },
      cssClass: "anchor-icon",
    },
    {
      label:
        '<i  class="material-icons anchor-icon" style="color:#000000;">delete</i>',
      a11yLabel: "Delete",
      onClick: ({ event }: { event: CalendarEvent }): void => {
        // this.events = this.events.filter((iEvent) => iEvent !== event);
        // this.handleEvent("Deleted", event);
        this.openDialog("delete_appointment", event, event.id);
      },
      cssClass: "anchor-icon",
    },
  ];

  clickedDate: Date;

  clickedColumn: number;
  zipCodeList: Zipcode[];
  zipCode: any;
  centerId: any;
  taxTypeId: any;
  taxpreparerList: DataTax[];
  minDate: Date;
  maxDate: Date;
  summaryList: DataSummary[];
  isShowCalendar = false;
  cancelDate: any;
  showPreviousButton: boolean;
  centerName: string;
  dayFullList: DayFull[] = [];
  tax_preparer_id: any;
  appointmentSummaryForTaxPrepearerList: AppointmentSummaryForTaxPreparers[] =
    [];
  taxSummaryData: PaginatedDataSource<
    AppointmentSummaryForTaxPreparers,
    SummaryQuery
  >;
  toogleDetailView: boolean;

  constructor(
    public sensez9Service: Sensez9Service,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router
  ) {
    const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear - 1, 11, 4);
    this.maxDate = new Date();
  }

  ngOnInit() {
    const summaryList: DataSummary[] = [];
    this.summaryData = new PaginatedDataSource<DataSummary, SummaryQuery>(
      (request, query) =>
        this.sensez9Service.page3(request, query, summaryList),
      this.initialSort,
      { search: "", data: undefined },
      10
    );
    const taxSummaryList: AppointmentSummaryForTaxPreparers[] = [];
    this.taxSummaryData = new PaginatedDataSource<
      AppointmentSummaryForTaxPreparers,
      SummaryQuery
    >(
      (request, query) =>
        this.sensez9Service.page5(request, query, taxSummaryList),
      this.initialSort,
      { search: "", data: undefined },
      10
    );

    // this.getAppointmentList();
    this.getZipCodeList();
    this.getTaxTypeList();
    this.getTax();
    this.getAppointmentsSummary();

    let currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (currentUser.obj.level == "1") {
      this.isAdmin = true;
    } else {
      this.isAdmin = false;
    }

    let currentdate = new Date();
    currentdate.setDate(currentdate.getDate());
    currentdate.setHours(23, 59, 59);
    if (this.viewDate.getDate() <= currentdate.getDate()) {
      this.showPreviousButton = false;
    } else {
      this.showPreviousButton = true;
    }
  }

  showCalendar() {
    this.openDialog("add_appointment", {}, null);
    // this.isShowCalendar = true;
  }

  previousSummary(date) {
    // site_id, start_date, end_date
    console.log(date, "previous date");
  }

  getAppointmentsSummary() {
    let input: any = {};

    if (this.centerId != undefined) {
      if (this.centerId != null) {
        input.site_id = this.centerId;
      }
    }
    let date = this.viewDate;
    let first_day_of_month = new Date(date.getFullYear(), date.getMonth(), 1);
    let currentMonth = date.getMonth();
    let last_day_of_month = new Date(
      date.getFullYear(),
      currentMonth,
      this.daysInMonth(currentMonth + 1, date.getFullYear())
    );

    input.start_date = this.datePipe.transform(
      first_day_of_month,
      "yyyy-MM-dd"
    );
    input.end_date = this.datePipe.transform(last_day_of_month, "yyyy-MM-dd");
    this.sensez9Service.getAppointmentsSummary(input).subscribe(
      (resp) => {
        const dataSummaryResponse: SummaryResponse = resp.body;
        this.summaryList = dataSummaryResponse.obj;
        this.summaryData = new PaginatedDataSource<DataSummary, SummaryQuery>(
          (request, query) =>
            this.sensez9Service.page3(request, query, this.summaryList),
          this.initialSort,
          { search: "", data: undefined },
          10
        );
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

  results() {
    var displayedCol = [];
    displayedCol.push("Total Appointments");
    displayedCol.push("Tax Preparer");
    displayedCol.push("Document Drop off ");
    displayedCol.push("Basic In Person ");
    displayedCol.push("Advance In Person");
    displayedCol.push("Return Visit Count");
    displayedCol.push("Total Hours");
    displayedCol.push("Total Hours Booked");
    displayedCol.push("Booking Percentage");
    displayedCol.push("Total Hours Available");
    var tableObj = this.summaryList;
    tableObj.forEach((element) => {
      element["Total Appointments"] = element.total_appointments;
      element["Tax Preparer"] = element.tax_preparer_count;
      element["Document Drop off"] = element.document_drop_off_count;
      element["Basic In Person"] = element.basic_in_person_count;
      element["Advance In Person"] = element.advance_in_person_count;
      element["Return Visit Count"] = element.return_visit_count;
      element["Total Hours"] = element.total_hours;
      element["Total Hours Booked"] = element.total_hours_booked;
      element["Booking Percentage"] = element.booking_percentage;
      element["Total Hours Available"] = element.total_hours_available;
    });
    this.downloadFile(tableObj, "Site Summary Report" + " ", displayedCol);
  }

  downloadFile(data, filename = "data", headers) {
    let csvData = this.ConvertToCSV(data, headers);
    // console.log(csvData);
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

  setView(view: CalendarView, value: any) {
    this.view = view;
    // console.log("value", value);
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;

    let currentdate = new Date();
    currentdate.setDate(currentdate.getDate());
    currentdate.setHours(23, 59, 59);
    if (this.viewDate.getDate() < currentdate.getDate()) {
      this.showPreviousButton = false;
    } else {
      this.showPreviousButton = true;
    }
  }

  closeOpenMonthViewDayNext() {
    this.activeDayIsOpen = false;
    this.showPreviousButton = true;
  }
  previousNextSummary(viewDate: any, flag: any) {
    // console.log("View Date", viewDate);
    this.getScheduledTaxPreparer(
      this.centerId,
      this.zipCode,
      this.tax_preparer_id
    );
    this.getAppointmentListById(this.centerId, this.zipCode);
    this.getAppointmentsSummary();
    this.getFullyBookingSummary();
    this.getAppointmentSummaryForTaxPreparers();
  }
  openDialog(action: string, obj: any, element: any) {
    const dialogConfig = new MatDialogConfig();
    obj.action = action;
    obj.object_id = element;
    obj.cancelDate = this.cancelDate;
    dialogConfig.backdropClass = "bdrop";
    dialogConfig.panelClass = "dialog-responsive";
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = obj;
    let dialogRef;
    if (action == "delete_appointment") {
      dialogRef = this.dialog.open(EditMessageComponent, dialogConfig);
    }

    if (action == "add_appointment") {
      dialogRef = this.dialog.open(AddUpdateAppointmentComponent, dialogConfig);
    }

    if (action == "edit_appointment") {
      dialogRef = this.dialog.open(AddUpdateAppointmentComponent, dialogConfig);
    }

    dialogRef.afterClosed().subscribe((result) => {
      if (result.event === "add_appointment" && result.isUpdated === true) {
        this.showNotification(
          "bottom",
          "right",
          "success",
          "Appointment added successfully",
          "announcement"
        );
        this.getAppointmentListById(this.centerId, this.zipCode);
      }
      if (result.event === "edit_appointment" && result.isUpdated === true) {
        this.showNotification(
          "bottom",
          "right",
          "success",
          "Appointment updated successfully",
          "announcement"
        );
        this.getAppointmentListById(this.centerId, this.zipCode);
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
  getScheduledTaxPreparer(site_id: any, zip_code: any, tax_preparer_id: any) {
    let input: any = {};
    if (zip_code != undefined) {
      if (zip_code != null) {
        input.zip_code = zip_code;
      }
    }
    if (site_id != undefined) {
      if (site_id != null) {
        input.site_id = site_id;
      }
    }
    if (tax_preparer_id != undefined) {
      if (tax_preparer_id != null) {
        input.tax_preparer_id = tax_preparer_id;
      }
    }
    let date = this.viewDate;
    let first_day_of_month = new Date(date.getFullYear(), date.getMonth(), 1);
    let currentMonth = date.getMonth();
    let last_day_of_month = new Date(
      date.getFullYear(),
      currentMonth,
      this.daysInMonth(currentMonth + 1, date.getFullYear())
    );

    input.start_date = this.datePipe.transform(
      first_day_of_month,
      "yyyy-MM-dd"
    );
    input.end_date = this.datePipe.transform(last_day_of_month, "yyyy-MM-dd");
    this.eventList = [];
    this.sensez9Service.getScheduledTaxPreparer(input).subscribe((resp) => {
      if (resp.status == 200) {
        const response: ScheduleTaxpreparerResponse = resp.body;
        this.eventList = response.obj;
        this.refresh.next();
        // this.eventList.forEach((element) => {
        //   this.events = [
        //     ...this.events,
        //     {
        //       id:element.event_id,
        //       title: element.start_date+" "+element.start_time + " " + element.event_title,
        //       start: new Date(element.start_date+" "+element.start_time),
        //       end: new Date(element.end_date+" "+element.end_time),
        //       color: {
        //         primary: element.event_color,
        //         secondary: "#FAE3E3",
        //       },

        //       draggable: false,
        //       resizable: {
        //         beforeStart: false,
        //         afterEnd: false,
        //       },
        //     },
        //   ];
        // });
      }
    });
  }

  getAppointmentList(site_id: any, zip_code: any) {
    let input: any = {};
    if (zip_code != undefined) {
      if (zip_code != null) {
        input.zip_code = zip_code;
      }
    }
    if (site_id != undefined) {
      if (site_id != null) {
        input.site_id = site_id;
      }
    }
    this.sensez9Service.getAppointmentList(input).subscribe((response) => {
      const appointmentResponse: AppointmentListResponse = response.body;
      this.appointmentList = appointmentResponse.obj;
      this.events = [];
      if (this.appointmentList != null) {
        this.appointmentList.forEach((element) => {
          let appointmentDate = this.datePipe.transform(
            new Date(element.appointment_date),
            "yyyy-MM-dd"
          );
          this.events = [
            ...this.events,

            {
              id: element.appointment_id,
              title:
                this.datePipe.transform(
                  new Date(
                    appointmentDate + " " + element.appointment_start_time
                  ),
                  "h:mm a"
                ) +
                " - " +
                this.datePipe.transform(
                  new Date(
                    appointmentDate + " " + element.appointment_end_time
                  ),
                  "h:mm a"
                ) +
                " " +
                (element.appointments != null
                  ? element.appointments.preparer_name
                  : "") +
                ", Client Name: " +
                element.client_name +
                " (" +
                element.client_type_name +
                ") " +
                ", Phone No: " +
                element.client_phone_no +
                ", Tax Type: " +
                element.tax_type_name +
                ", Meeting Type: " +
                element.meeting_type_name,
              start: new Date(
                appointmentDate + " " + element.appointment_start_time
              ),
              end: new Date(
                appointmentDate + " " + element.appointment_end_time
              ),
              color: {
                primary: "#" + element.appointments.event_color,
                secondary: "#" + element.appointments.event_color,
              },

              draggable: true,
              resizable: {
                beforeStart: true,
                afterEnd: true,
              },

              actions: this.actions,
              meta: {
                type: "type_" + element.appointments.event_color,
              },
            },
          ];
        });
      }
      this.processGrouping();
    });
  }
  daysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
  }
  getFullyBookingSummary() {
    let input: any = {};
    if (this.centerId != undefined) {
      if (this.centerId != null) {
        input.site_id = this.centerId;
      }
    }
    if (this.tax_preparer_id != undefined) {
      if (this.tax_preparer_id != null) {
        input.tax_preparer_id = this.tax_preparer_id;
      }
    }
    let date = this.viewDate;
    let first_day_of_month = new Date(date.getFullYear(), date.getMonth(), 1);
    let currentMonth = date.getMonth();
    let last_day_of_month = new Date(
      date.getFullYear(),
      currentMonth,
      this.daysInMonth(currentMonth + 1, date.getFullYear())
    );

    input.start_date = this.datePipe.transform(
      first_day_of_month,
      "yyyy-MM-dd"
    );
    input.end_date = this.datePipe.transform(last_day_of_month, "yyyy-MM-dd");
    this.sensez9Service.getFullyBookingSummary(input).subscribe((response) => {
      const appointmentResponse: DayFullResponse = response.body;
      this.dayFullList = appointmentResponse.obj;
    });
    this.refresh.next();
  }
  getAppointmentSummaryForTaxPreparers() {
    let input: any = {};
    if (this.centerId != undefined) {
      if (this.centerId != null) {
        input.site_id = this.centerId;
      }
    }
    if (this.tax_preparer_id != undefined) {
      if (this.tax_preparer_id != null) {
        input.tax_preparer_id = this.tax_preparer_id;
      }
    }
    let date = this.viewDate;
    let first_day_of_month = new Date(date.getFullYear(), date.getMonth(), 1);
    let currentMonth = date.getMonth();
    let last_day_of_month = new Date(
      date.getFullYear(),
      currentMonth,
      this.daysInMonth(currentMonth + 1, date.getFullYear())
    );

    input.start_date = this.datePipe.transform(
      first_day_of_month,
      "yyyy-MM-dd"
    );
    input.end_date = this.datePipe.transform(last_day_of_month, "yyyy-MM-dd");

    this.sensez9Service
      .getAppointmentSummaryForTaxPreparers(input)
      .subscribe((response) => {
        const appointmentResponse: AppointmentSummaryForTaxPreparersResponse =
          response.body;
        this.appointmentSummaryForTaxPrepearerList = appointmentResponse.obj;
        this.taxSummaryData = new PaginatedDataSource<
          AppointmentSummaryForTaxPreparers,
          SummaryQuery
        >(
          (request, query) =>
            this.sensez9Service.page5(
              request,
              query,
              this.appointmentSummaryForTaxPrepearerList
            ),
          this.initialSort,
          { search: "", data: undefined },
          10
        );
      });
  }
  getAppointmentListById(site_id: any, zip_code: any) {
    let input: any = {};
    if (zip_code != undefined) {
      if (zip_code != null) {
        input.zip_code = zip_code;
      }
    }
    if (site_id != undefined) {
      if (site_id != null) {
        input.site_id = site_id;
      }
    }
    if (this.tax_preparer_id != undefined) {
      if (this.tax_preparer_id != null) {
        input.tax_preparer_id = this.tax_preparer_id;
      }
    }
    let date = this.viewDate;
    let first_day_of_month = new Date(date.getFullYear(), date.getMonth(), 1);
    let currentMonth = date.getMonth();
    let last_day_of_month = new Date(
      date.getFullYear(),
      currentMonth,
      this.daysInMonth(currentMonth + 1, date.getFullYear())
    );

    input.start_date = this.datePipe.transform(
      first_day_of_month,
      "yyyy-MM-dd"
    );
    input.end_date = this.datePipe.transform(last_day_of_month, "yyyy-MM-dd");

    this.sensez9Service.getAppointmentListById(input).subscribe(
      (response) => {
        const appointmentResponse: AppointmentListResponse = response.body;
        this.appointmentList = appointmentResponse.obj;
        this.events = [];
        if (this.appointmentList != null) {
          this.appointmentList.forEach((element) => {
            let appointmentDate = this.datePipe.transform(
              new Date(element.appointment_date),
              "yyyy-MM-dd"
            );
            this.events = [
              ...this.events,

              {
                id: element.appointment_id,
                title:
                  this.datePipe.transform(
                    new Date(
                      appointmentDate + " " + element.appointment_start_time
                    ),
                    "h:mm a"
                  ) +
                  " - " +
                  this.datePipe.transform(
                    new Date(
                      appointmentDate + " " + element.appointment_end_time
                    ),
                    "h:mm a"
                  ) +
                  " " +
                  (element.appointments != null
                    ? element.appointments.preparer_name
                    : "") +
                  ", Client Name: " +
                  element.client_name +
                  " (" +
                  element.client_type_name +
                  ") " +
                  ", Phone No: " +
                  element.client_phone_no +
                  ", Tax Type: " +
                  element.tax_type_name +
                  ", Meeting Type: " +
                  element.meeting_type_name,
                start: new Date(
                  appointmentDate + " " + element.appointment_start_time
                ),
                end: new Date(
                  appointmentDate + " " + element.appointment_end_time
                ),
                color: {
                  primary: "#" + element.appointments.event_color,
                  secondary: "#" + element.appointments.event_color,
                },

                draggable: true,
                resizable: {
                  beforeStart: true,
                  afterEnd: true,
                },

                actions: this.actions,
                meta: {
                  type: "type_" + element.appointments.event_color,
                },
              },
            ];
          });
        }
        this.processGrouping();
      },
      (error) => {
        this.processGrouping();
      }
    );
  }

  processGrouping() {
    this.groupedSimilarEvents = [];
    const processedEvents = new Set();
    if (this.events != null) {
      this.events.forEach((event) => {
        if (processedEvents.has(event)) {
          return;
        }
        const similarEvents = this.events.filter((otherEvent) => {
          return (
            otherEvent !== event &&
            !processedEvents.has(otherEvent) &&
            isSameMinute(otherEvent.start, event.start) &&
            (isSameMinute(otherEvent.end, event.end) ||
              (!otherEvent.end && !event.end)) &&
            otherEvent.color.primary === event.color.primary &&
            otherEvent.color.secondary === event.color.secondary
          );
        });
        processedEvents.add(event);
        similarEvents.forEach((otherEvent) => {
          processedEvents.add(otherEvent);
        });
        if (similarEvents.length > 0) {
          this.groupedSimilarEvents.push({
            title: `${similarEvents.length + 1} events`,
            color: event.color,
            start: event.start,
            end: event.end,
            meta: {
              groupedEvents: [event, ...similarEvents],
            },
          });
        } else {
          this.groupedSimilarEvents.push(event);
        }
      });
    }
    this.refresh.next();
  }
  convertTZ(date, tzString) {
    //Asia/Kolkata

    return new Date(
      (typeof date === "string" || typeof date === "number"
        ? new Date(date)
        : date
      ).toLocaleString("en-US", { timeZone: tzString })
    );
  }

  getDateString(date: Date): string {
    var months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return (
      months[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear()
    );
  }

  getJoinedStingDate(date: number, time: number): string {
    return (
      this.getDateString(this.convertTZ(date, "Asia/Kolkata")) +
      " " +
      this.getTimeString(this.convertTZ(time, "Asia/Kolkata"))
    );
  }

  getJoinedDate(date: number, time: number): Date {
    let currentDate: Date = this.convertTZ(date, "Asia/Kolkata");
    let currentTime: Date = this.convertTZ(time, "Asia/Kolkata");
    let returnDate: Date;
    returnDate = currentDate;
    returnDate.setHours(currentTime.getHours());
    returnDate.setMinutes(currentTime.getMinutes());
    returnDate.setSeconds(currentTime.getSeconds());
    return returnDate;
  }

  getTimeString(date: Date): string {
    let hours: string;
    let minutes: string;
    let am_pm: string;
    if (date.getHours() < 10) {
      hours = "0" + date.getHours();
      am_pm = "AM";
    } else {
      if (date.getHours() < 12) {
        am_pm = "AM";
      } else {
        am_pm = "PM";
      }
      hours = "" + date.getHours();
    }
    if (date.getMinutes() < 10) {
      minutes = "0" + date.getMinutes();
    } else {
      minutes = "" + date.getMinutes();
    }

    return hours + ":" + minutes + " " + am_pm;
  }

  getLongStringToDate(stringNumber) {
    if (stringNumber != null) {
      var milliSeonds = Number(stringNumber);
      var date = new Date(milliSeonds);
      return date;
    } else {
      return "";
    }
  }

  beforeMonthViewRender({
    body,
  }: {
    body: CalendarMonthViewDay<EventGroupMeta>[];
  }): void {
    // month view has a different UX from the week and day view so we only really need to group by the type
    // console.log("Body=", body);
    body.forEach((cell) => {
      const groups = {};
      cell.events.forEach((event: CalendarEvent<EventGroupMeta>) => {
        groups[event.meta.type] = groups[event.meta.type] || [];
        groups[event.meta.type].push(event);
      });
      cell["eventGroups"] = (<any>Object).entries(groups);
    });
  }

  beforeMonthlyViewRender(month: CalendarMonthViewBeforeRenderEvent) {
    month.body.forEach((element) => {
      // console.log(element.date);

      let dateFoundFlag: boolean = false;
      let dayFullAvailableFalg: boolean = false;
      if (this.eventList != null) {
        this.eventList.forEach((event) => {
          // console.log("Event date=",new Date(event.start_date))
          if (
            this.datePipe.transform(element.date, "dd-MM-yyyy") ==
            this.datePipe.transform(new Date(event.start_date), "dd-MM-yyyy")
          ) {
            dateFoundFlag = true;
          }
        });
      }
      if (this.appointmentList != null) {
        this.appointmentList.forEach((appointment) => {
          if (
            this.datePipe.transform(element.date, "dd-MM-yyyy") ==
            this.datePipe.transform(
              new Date(appointment.appointment_date),
              "dd-MM-yyyy"
            )
          ) {
            dateFoundFlag = true;
          }
        });
      }
      if (!dateFoundFlag) {
        element.cssClass = "cal-enabled ";
        element.inMonth = false;
        element.backgroundColor = this.myColor.light_gray;
        // element.newColor = this.myColor.black;
      }
      if (this.dayFullList != null) {
        this.dayFullList.forEach((dayfull) => {
          // console.log(
          //   "Calendar date=",
          //   this.datePipe.transform(element.date, "yyyy-MM-dd")
          // );
          // console.log("Day Full date=", dayfull.date);

          if (
            this.datePipe.transform(element.date, "yyyy-MM-dd") == dayfull.date
          ) {
            if (dayfull.isFull == 1) {
              dayFullAvailableFalg = true;
            }
          }
        });
      }
      if (dayFullAvailableFalg) {
        element.cssClass = "cal-yellow ";
        element.inMonth = false;
        element.backgroundColor = this.myColor.light_yellow;
        // element.newColor = this.myColor.black;
      }
    });
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  monthDayClicked({
    date,
    events,
  }: {
    date: Date;
    events: CalendarEvent[];
  }): void {
    let dateFoundFlag: boolean = false;
    if (this.eventList != null) {
      this.eventList.forEach((event) => {
        // console.log("Event date=", new Date(event.start_date));
        if (
          this.datePipe.transform(date, "dd-MM-yyyy") ==
          this.datePipe.transform(new Date(event.start_date), "dd-MM-yyyy")
        ) {
          dateFoundFlag = true;
        }
      });
    }
    if (this.appointmentList != null) {
      this.appointmentList.forEach((appointment) => {
        // console.log("Event date=", new Date(appointment.appointment_date));
        if (
          this.datePipe.transform(date, "dd-MM-yyyy") ==
          this.datePipe.transform(
            new Date(appointment.appointment_date),
            "dd-MM-yyyy"
          )
        ) {
          dateFoundFlag = true;
        }
      });
    }
    // dateFoundFlag = true;
    if (dateFoundFlag) {
      this.view = CalendarView.Day;
      this.viewDate = date;
    } else {
      this.openMessageDialog(
        "message_dialog",
        "Alert",
        "There is no any tax preparer available for this day"
      );
    }

    this.clickedDate = date;
  }

  hourSegmentClicked(date): void {
    // console.log("Date=", date);
    let object: any = {};
    object.selected_date = date;
    if (this.centerId != undefined) {
      if (this.centerId != null) {
        object.selected_site_id = this.centerId;
      }
    }
    this.cancelDate = date;
    let currentdate = new Date();
    currentdate.setDate(currentdate.getDate());
    currentdate.setHours(23, 59, 59);
    // console.log(currentdate, "currentdate");
    let dateFoundFlag: boolean = false;
    if (date.getTime() <= currentdate.getTime()) {
      //dialog box which says you cant add an appointment
      this.openMessageDialog(
        "message_dialog",
        "Alert",
        "You cannot schedule appointments for previous days"
      );
    } else {
      if (this.eventList != null) {
        this.eventList.forEach((event) => {
          if (
            this.datePipe.transform(date, "dd-MM-yyyy") ==
            this.datePipe.transform(new Date(event.start_date), "dd-MM-yyyy")
          ) {
            if (
              date.getTime() >=
                new Date(event.start_date + " " + event.start_time).getTime() &&
              date.getTime() <
                new Date(event.start_date + " " + event.end_time).getTime()
            ) {
              dateFoundFlag = true;
            }
          }
        });
        if (dateFoundFlag) {
          this.checkHourlyExistingBooking(date, object);
        } else {
          this.openMessageDialog(
            "message_dialog",
            "Alert",
            "There are no tax preparer available for this time"
          );
        }
        // this.openDialog("add_appointment", object, null);
      }
    }
  }
  openMessageDialog(action: string, title: string, message: string) {
    const dialogConfig = new MatDialogConfig();
    let obj: any = {};
    obj.action = action;
    obj.title = title;
    obj.message = message;
    dialogConfig.backdropClass = "bdrop";
    dialogConfig.panelClass = "dialog-responsive";
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = obj;
    let dialogRef;

    if (action == "message_dialog") {
      dialogRef = this.dialog.open(TaxScreeningMessageComponent, dialogConfig);
    }
    dialogRef.afterClosed().subscribe((result) => {
      if (result.event === "message_dialog" && result.isUpdated === true) {
      }
    });
  }
  getZipCodeList() {
    const loginResponse: LoginUserInterface = JSON.parse(
      localStorage.getItem("currentUser")
    );
    const loggedInUser = loginResponse.obj;
    let input = { user_id: loggedInUser.user_id };
    this.sensez9Service.getZipCodeList(input).subscribe((response) => {
      const zipCodeResponse: ZipcodeResponse = response.body;
      this.zipCodeList = zipCodeResponse.obj;
      if(this.zipCodeList.length == 1){
        this.zipCode = this.zipCodeList[0].name;
      }
    });
  }
  getCenterCodeList(zipCode: any) {
    const loginResponse: LoginUserInterface = JSON.parse(
      localStorage.getItem("currentUser")
    );
    const loggedInUser = loginResponse.obj;
    let input = { user_id: loggedInUser.user_id, zip_code: zipCode };
    this.sensez9Service.getCenterList(input).subscribe((response) => {
      const centerListResponse: CenterResponse = response.body;
      this.centerList = centerListResponse.obj;
      if(this.centerList.length == 1){
        this.centerId = this.centerList[0].id;
      }
    });
  }

  selectZipcode(event, id: any, zipCodeValue: any) {
    if (event.isUserInput) {
      this.zipCode = id;
      this.getCenterCodeList(this.zipCode);
      this.centerId = undefined;
      this.centerName = undefined;
      this.tax_preparer_id = undefined;
      this.getTaxPreparerById(this.centerId, this.zipCode);
      this.getScheduledTaxPreparer(
        this.centerId,
        this.zipCode,
        this.tax_preparer_id
      );
      this.getAppointmentListById(this.centerId, this.zipCode);
      this.getAppointmentsSummary();
      this.getFullyBookingSummary();
      this.getAppointmentSummaryForTaxPreparers();
    }
  }
  selectCenter(event, id: any) {
    if (event.isUserInput) {
      this.centerId = id;
      this.tax_preparer_id = undefined;
      this.getTaxPreparerById(this.centerId, this.zipCode);
      this.getScheduledTaxPreparer(
        this.centerId,
        this.zipCode,
        this.tax_preparer_id
      );
      this.getAppointmentListById(this.centerId, this.zipCode);
      this.centerList.forEach((center) => {
        if (center.id == id) {
          this.centerName = center.name;
        }
      });
      this.getAppointmentsSummary();
      this.getFullyBookingSummary();
      this.getAppointmentSummaryForTaxPreparers();
      // this.isShowCalendar = true;
    }
  }

  displayCalendar(){
  this.isShowCalendar = true;
  }

  selectTaxType(event, id: any) {
    if (event.isUserInput) {
      this.taxTypeId = id;
    }
  }

  selectTaxPrepare(event, id: any) {
    if (event.isUserInput) {
      this.tax_preparer_id = id;
      this.getScheduledTaxPreparer(
        this.centerId,
        this.zipCode,
        this.tax_preparer_id
      );
      this.getAppointmentListById(this.centerId, this.zipCode);
      this.getFullyBookingSummary();
      this.getAppointmentSummaryForTaxPreparers();
    }
  }
  getTaxTypeList() {
    const loginResponse: LoginUserInterface = JSON.parse(
      localStorage.getItem("currentUser")
    );
    const loggedInUser = loginResponse.obj;
    let input = { user_id: loggedInUser.user_id };
    this.sensez9Service.getTaxTypeList().subscribe((response) => {
      const taxResponse: TaxTypeResponse = response.body;
      this.taxTypeList = taxResponse.obj;
    });
  }
  getTax() {
    let input: any = {};
    let currentUser = JSON.parse(localStorage.getItem("currentUser"));
    let added_by = currentUser.obj.user_id;
    input.user_id = added_by;
    this.sensez9Service.getAllTaxPreparers(input).subscribe((resp) => {
      const taxPrepareResponse: TaxResponse = resp.body;
      this.taxpreparerList = [];
      this.taxpreparerList.push({
        preparer_id: 0,
        preparer_name: "All",
      });
      if (taxPrepareResponse.status == 200) {
        this.taxpreparerList.push(...taxPrepareResponse.obj);
      }
    });
  }

  getTaxPreparerById(site_id: any, zip_code: any) {
    let input: any = {};
    if (zip_code != undefined) {
      if (zip_code != null) {
        input.zip_code = zip_code;
      }
    }
    if (site_id != undefined) {
      if (site_id != null) {
        input.site_id = site_id;
      }
    }

    this.sensez9Service.getAllTaxPreparersById(input).subscribe((resp) => {
      const taxPrepareResponse: TaxResponse = resp.body;
      //this.taxpreparerList = taxPrepareResponse.obj;
      this.taxpreparerList = [];
      this.taxpreparerList.push({
        preparer_id: 0,
        preparer_name: "All",
      });
      if (taxPrepareResponse.status == 200) {
        this.taxpreparerList.push(...taxPrepareResponse.obj);
      }
    });
  }

  beforeWeekViewRender(renderEvent: CalendarWeekViewBeforeRenderEvent) {
    renderEvent.hourColumns.forEach((hourColumn) => {
      let dateFoundFlag: boolean = false;

      // this.eventList.forEach((event) => {
      //   // console.log("Event date=",new Date(event.start_date))
      //   if (
      //     this.datePipe.transform(hourColumn.date, "dd-MM-yyyy") ==
      //     this.datePipe.transform(new Date(event.start_date), "dd-MM-yyyy")
      //   ) {
      //     dateFoundFlag = true;
      //   }
      // });
      if (this.eventList != null) {
        this.eventList.forEach((event) => {
          //   // console.log("Event date=",new Date(event.start_date))
          if (
            this.datePipe.transform(hourColumn.date, "dd-MM-yyyy") ==
            this.datePipe.transform(new Date(event.start_date), "dd-MM-yyyy")
          ) {
            hourColumn.hours.forEach((hour) => {
              // console.log("Hour=", hour);

              hour.segments.forEach((segment) => {
                let currentTime = segment.date.getTime();
                let startTime = new Date(
                  event.start_date + " " + event.start_time
                ).getTime();
                let endTime = new Date(
                  event.start_date + " " + event.end_time
                ).getTime();
                // console.log("currentTime", currentTime);
                // console.log("startTime", startTime);
                // console.log("endTime", endTime);
                if (
                  segment.date.getTime() >=
                    new Date(
                      event.start_date + " " + event.start_time
                    ).getTime() &&
                  segment.date.getTime() <=
                    new Date(event.start_date + " " + event.end_time).getTime()
                ) {
                  // segment.cssClass = "cal-enabled";
                } else {
                  segment.cssClass = "cal-disabled";
                }
              });
            });
          }
        });
      }

      if (!dateFoundFlag) {
        if (this.eventList != null) {
          this.eventList.forEach((event) => {
            // console.log("Event date=", new Date(event.start_date));
            if (
              this.datePipe.transform(hourColumn.date, "dd-MM-yyyy") ==
              this.datePipe.transform(new Date(event.start_date), "dd-MM-yyyy")
            ) {
              dateFoundFlag = true;
            }
          });
          if (dateFoundFlag == false) {
            hourColumn.hours.forEach((hour) => {
              console.log("Hour=", hour);

              hour.segments.forEach((segment) => {
                segment.cssClass = "cal-disabled";
              });
            });
          }
        }
      }
    });
  }
  beforeDayViewRender(renderEvent: CalendarDayViewBeforeRenderEvent) {
    renderEvent.hourColumns.forEach((hourColumn) => {
      let dateFoundFlag: boolean = false;

      // this.eventList.forEach((event) => {
      //   // console.log("Event date=",new Date(event.start_date))
      //   if (
      //     this.datePipe.transform(hourColumn.date, "dd-MM-yyyy") ==
      //     this.datePipe.transform(new Date(event.start_date), "dd-MM-yyyy")
      //   ) {
      //     dateFoundFlag = true;
      //   }
      // });
      if (this.eventList != null) {
        this.eventList.forEach((event) => {
          //   // console.log("Event date=",new Date(event.start_date))
          if (
            this.datePipe.transform(hourColumn.date, "dd-MM-yyyy") ==
            this.datePipe.transform(new Date(event.start_date), "dd-MM-yyyy")
          ) {
            dateFoundFlag = true;
            hourColumn.hours.forEach((hour) => {
              console.log("Hour=", hour);

              hour.segments.forEach((segment) => {
                let currentTime = segment.date.getTime();
                let startTime = new Date(
                  event.start_date + " " + event.start_time
                ).getTime();
                let endTime = new Date(
                  event.start_date + " " + event.end_time
                ).getTime();
                // console.log("currentTime", currentTime);
                // console.log("startTime", startTime);
                // console.log("endTime", endTime);
                if (currentTime >= startTime && currentTime <= endTime) {
                  // segment.cssClass = "cal-enabled";
                } else {
                  segment.cssClass = "cal-disabled";
                }
              });
            });
          }
        });
      }

      if (!dateFoundFlag) {
        if (this.eventList != null) {
          this.eventList.forEach((event) => {
            // console.log("Event date=", new Date(event.start_date));
            if (
              this.datePipe.transform(hourColumn.date, "dd-MM-yyyy") ==
              this.datePipe.transform(new Date(event.start_date), "dd-MM-yyyy")
            ) {
              dateFoundFlag = true;
            }
          });
          if (dateFoundFlag == false) {
            hourColumn.hours.forEach((hour) => {
              console.log("Hour=", hour);

              hour.segments.forEach((segment) => {
                segment.cssClass = "cal-disabled";
              });
            });
          }
        }
      }
    });
  }

  checkHourlyExistingBooking(selectedDate: Date, object: any): boolean {
    this.blockUI.start(
      "Please wait a moment, we are checking if a Tax preparer is available for this time slot."
    );
    let input: any = {};
    if (this.centerId != undefined) {
      input.site_id = this.centerId;
    }
    if (selectedDate != undefined) {
      if (selectedDate != null) {
        input.start_date = this.datePipe.transform(selectedDate, "yyyy-MM-dd");
        input.start_time = this.datePipe.transform(selectedDate, "HH:mm:ss");
      }
    }
    let returnValue: boolean = false;
    this.sensez9Service
      .checkHourlyExistingBooking(input)
      .subscribe((response) => {
        const result: NormalResponse = response.body;
        console.log("Status", result);
        if (result.status == 200) {
          setTimeout(() => {
            this.blockUI.stop();
            this.openDialog("add_appointment", object, null);
          }, 2500);
        } else {
          setTimeout(() => {
            this.blockUI.stop();
            returnValue = false;
            this.openMessageDialog("message_dialog", "Alert", result.message);
          }, 2500);
        }
      });
    return returnValue;
  }

  setToogelView() {
    this.toogleDetailView = !this.toogleDetailView;
  }
}
