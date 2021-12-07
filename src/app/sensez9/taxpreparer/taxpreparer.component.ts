import { Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
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
import { Sensez9Service, TaxQuery, UsersQuery } from "../sensez9.service";
import { DataTax, TaxResponse } from "./TaxPreparerResponse";
import { AddUpdateTaxpreparerComponent } from "./add-update-taxpreparer/add-update-taxpreparer.component";
import { Subject } from "rxjs";
import { NormalResponse } from "app/screens/models/normal-response";
import { BlockUI, NgBlockUI } from "ng-block-ui";
import { BlockTemplateComponent } from "app/widgets/block-template/block-template.component";
import { TaxScreeningMessageComponent } from "app/screens/tax-screening-message/tax-screening-message.component";

@Component({
  selector: "app-taxpreparer",
  templateUrl: "./taxpreparer.component.html",
  styleUrls: ["./taxpreparer.component.css"],
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
export class TaxpreparerComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  blockTemplate: BlockTemplateComponent;
  spinnerEnabled = false;
  keys: string[];
  dataSheet = new Subject();
  @ViewChild("inputFile") inputFile: ElementRef;
  isExcelFile: boolean;

  isDownloadDisabled = true;

  taxData: PaginatedDataSource<DataTax, TaxQuery>;
  initialSort: Sort<DataTax> = { property: "created_date", order: "desc" };

  displayedColumns: string[] = [
    "sr_no",
    "preparer_name",
    "site",
    "military",
    "spanish",
    "international",
    // "preparer_contactno",
    // "preparer_email",
    // "preparer_zipcode",
    // 'status',
    // 'site_id',

    // 'taxType',
    // 'tax_type_advance_in_person_time',

    "created_date",
    "approve",
    "action",
  ];

  displayedColumns1: string[] = [
    "sr_no",
    "preparer_name",
    "site",
    "military",
    "spanish",
    "international",
    // "preparer_contactno",
    // "preparer_email",
    // "preparer_zipcode",
    // 'status',
    // 'site_id',

    // 'taxType',
    // 'tax_type_advance_in_person_time',

    "created_date",
    "approve",
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

  allTaxResp: any;
  taxId: any;
  allSitesResp: any;
  isAdmin = false;
  selectedFile: File;
  url: string | ArrayBuffer;
  snackbarMessage: string;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private overlay: Overlay,
    public dialog: MatDialog,
    public sensez9Service: Sensez9Service // private _snackBar: MatSnackBar
  ) {
    const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear - 1, 11, 4);
    this.maxDate = new Date();
  }

  ngOnInit(): void {
    let currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (currentUser.obj.level == "1" || currentUser.obj.level == "2") {
      this.isAdmin = true;
    } else {
      this.isAdmin = false;
    }
    this.loadSummary("init");
    this.getTax();
    this.getAllSites();
  }
  getTax() {
    let input: any = {};
    let currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (currentUser.obj.level == "1" || currentUser.obj.level == "2") {
    } else {
      let added_by = currentUser.obj.user_id;
      input.user_id = added_by;
    }

    this.sensez9Service.getAllTaxPreparers(input).subscribe((resp) => {
      const taxPrepareResponse: TaxResponse = resp.body;
      this.allTaxResp = taxPrepareResponse.obj;
      if (this.allTaxResp !== null) {
        var taxList = this.allTaxResp;
        this.taxData = new PaginatedDataSource<DataTax, TaxQuery>(
          (request, query) =>
            this.sensez9Service.page1(request, query, taxList),
          this.initialSort,
          { search: "", data: undefined },
          10
        );
      }
    });
  }
  // getTax() {
  //   this.sensez9Service.getTax().subscribe(
  //     (resp) => {
  //       this.allTaxResp = resp.obj;
  //       if (this.allTaxResp !== null) {
  //         var taxList = resp.obj;
  //         this.taxData = new PaginatedDataSource<DataTax, TaxQuery>(
  //           (request, query) =>
  //             this.sensez9Service.page1(request, query, taxList),
  //           this.initialSort,
  //           { search: "", data: undefined },
  //           10
  //         );
  //       }
  //     },
  //     (err: HttpErrorResponse) => {
  //       console.log(err.message);
  //       if (err.error instanceof Error) {
  //         console.log(" An error occurred:", err.error.message);
  //       } else {
  //         // Backend returns unsuccessful response codes such as 404, 500 etc
  //         console.log("Rulelist Response body:", err.error);
  //       }
  //     }
  //   );
  // }

  openModal(id) {
    this.taxId = id;
    const buttonModal = document.getElementById("openModalButton");
    console.log("buttonModal", buttonModal);
    buttonModal.click();
  }

  deleteTax() {
    let input = {
      user_id: this.taxId,
    };
    this.sensez9Service.deleteTax(input).subscribe(
      (resp) => {
        if (resp.status == 200) {
          this.getTax();
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

  uploadTaxTemplate() {
    const fd = new FormData();
    let file = this.selectedFile;

    let currentUser = JSON.parse(localStorage.getItem("currentUser"));
    let added_by = currentUser.obj.user_id;
    this.blockUI.start(
      "Please wait Your excel is being uploaded. It may few mins to upload."
    );
    this.sensez9Service.uploadTaxTemplate(file, added_by).subscribe((resp) => {
      setTimeout(() => {
        this.blockUI.stop();
        if (resp.status == -201) {
          this.openMessageDialog("message_dialog", "Error", resp.message);
        } else {
          this.showNotification(
            "bottom",
            "right",
            "success",
            resp.message,
            "announcement"
          );
        }
      }, 2500);
    });
  }

  // openSnackBar() {
  //   this.snackbarMessage = "Thank you for your response";
  //   this._snackBar.open(this.snackbarMessage, void 0, {
  //     panelClass: ["custom-style"],
  //     duration: 2000,
  //     verticalPosition: "top", // 'top' | 'bottom'
  //     horizontalPosition: "center",
  //   });
  // }

  onFileSelected(event) {
    this.selectedFile = <File>event.target.files[0];
    var reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]); // read file as data url

    reader.onload = (event) => {
      // called once readAsDataURL is completed
      this.url = event.target.result;
    };
    this.onUpload();
  }

  onUpload() {
    const fd = new FormData();
    fd.append("file", this.selectedFile, this.selectedFile.name);
    this.uploadTaxTemplate();
  }

  updateTax(data) {
    data.update = true;
    localStorage.setItem("taxpreparer", JSON.stringify(data));
    this.router.navigate(["/addupdateTaxPreparer", data]);
  }

  approve(data) {
    data.approve = true;
    localStorage.setItem("taxpreparer", JSON.stringify(data));
    this.router.navigate(["/addupdateTaxPreparer", data]);
  }
  getAllSites() {
    this.sensez9Service.getAllSites().subscribe(
      (resp) => {
        this.allSitesResp = resp.obj;
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
    displayedCol.push("Name");
    displayedCol.push("Contact No.");
    displayedCol.push("ZipCode");
    displayedCol.push("Email");
    displayedCol.push("Status");
    displayedCol.push("Created Date");
    var tableObj = this.allTaxResp;
    tableObj.forEach((element) => {
      element["Username"] = element.preparer_name;
      element["Contact No."] = element.preparer_contactno;
      element["ZipCode"] = element.preparer_zipcode;
      element["Email"] = element.preparer_email;
      element["Status"] = element.status;
      element["Added On"] = element.created_date;
    });
    this.downloadFile(
      tableObj,
      "Tax Preparer Report" + " " + this.todayDate,
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
      dialogRef = this.dialog.open(AddUpdateTaxpreparerComponent, dialogConfig);
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

  downloadUploadedTaxSchedular() {
    this.sensez9Service
      .getUploadedTaxSchedulerCalendarXls()
      .subscribe((response) => {
        const result: NormalResponse = response.body;
        if (result.status == 200) {
          window.open(result.obj, "_blank");
        }
      });
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
}
