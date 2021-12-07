import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
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
import { Sensez9Service, UsersQuery } from "../sensez9.service";
import { AddUpdateUsersComponent } from "./add-update-users/add-update-users.component";
import { DataUsers } from "./UserResponse";

@Component({
  selector: "app-users",
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: "./users.component.html",
  styleUrls: ["./users.component.css"],
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
export class UsersComponent implements OnInit {
  usersData: PaginatedDataSource<DataUsers, UsersQuery>;
  initialSort: Sort<DataUsers> = { property: "created_date", order: "desc" };

  displayedColumns: string[] = [
    "sr_no",
    "username",
    "password",
    "first_name",
    "last_name",
    "zip_code",
    "contact_no",
    "email",
    "level",
    "site",
    "created_date",
    "action",
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
  userId: any;
  allUsersResp: any;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private overlay: Overlay,
    public sensez9Service: Sensez9Service
  ) {
    const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear - 1, 11, 4);
    this.maxDate = new Date();
  }

  ngOnInit(): void {
    let currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const usersList: DataUsers[] = [];
    this.usersData = new PaginatedDataSource<DataUsers, UsersQuery>(
      (request, query) => this.sensez9Service.page(request, query, usersList),
      this.initialSort,
      { search: "", data: undefined },
      10
    );
    this.loadSummary("init");
    this.getUsers();
  }

  getUsers() {
    this.sensez9Service.getUsers().subscribe(
      (resp) => {
        this.allUsersResp = resp.obj;
        if (this.allUsersResp !== null) {
          var usersList = resp.obj;
          this.usersData = new PaginatedDataSource<DataUsers, UsersQuery>(
            (request, query) =>
              this.sensez9Service.page(request, query, usersList),
            this.initialSort,
            { search: "", data: undefined },
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
    this.userId = id;
    const buttonModal = document.getElementById("openModalButton");
    console.log("buttonModal", buttonModal);
    buttonModal.click();
  }

  deleteUsers() {
    let input = {
      user_id: this.userId,
    };
    this.sensez9Service.deleteUsers(input).subscribe(
      (resp) => {
        if (resp.status == 200) {
          this.getUsers();
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

  updateUsers(data) {
    data.update = true;
    // data.sites = JSON.parse(data.sites)
    this.router.navigate(["/addupdateUsers", data]);
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
    var displayedCol = [];
    displayedCol.push("Username");
    displayedCol.push("Password");
    displayedCol.push("First Name");
    displayedCol.push("Last Name");
    displayedCol.push("ZipCode");
    displayedCol.push("Contact No.");
    displayedCol.push("Email");
    displayedCol.push("Level");
    displayedCol.push("Created Date");
    var tableObj = this.allUsersResp;
    tableObj.forEach((element) => {
      element["Username"] = element.username;
      element["Password"] = element.password;
      element["First Name"] = element.first_name;
      element["Last Name"] = element.last_name;
      element["ZipCode"] = element.zip_code;
      element["Contact No."] = element.contact_no;
      element["Email"] = element.email;
      element["Level"] = element.level;
      element["Added On"] = element.created_date;
    });
    this.downloadFile(
      tableObj,
      "Users Report" + " " + this.todayDate,
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
      dialogRef = this.dialog.open(AddUpdateUsersComponent, dialogConfig);
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
