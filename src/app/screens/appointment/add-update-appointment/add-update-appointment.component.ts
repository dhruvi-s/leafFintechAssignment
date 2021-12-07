import { DatePipe } from "@angular/common";
import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { Appointment } from "app/screens/models/appointment";
import {
  CitizenType,
  CitizenTypeResponse,
} from "app/screens/models/citizen-type";
import { LoginUserInterface } from "app/screens/models/login-user";
import { NormalResponse } from "app/screens/models/normal-response";
import { TaxType, TaxTypeResponse } from "app/screens/models/TaxType";
import { TaxScreeningMessageComponent } from "app/screens/tax-screening-message/tax-screening-message.component";
import { Sensez9Service } from "app/sensez9/sensez9.service";
import { DataSite, SiteResponse } from "app/sensez9/site/SiteResponse";
import {
  DataTax,
  TaxResponse,
} from "app/sensez9/taxpreparer/TaxPreparerResponse";
import { BlockTemplateComponent } from "app/widgets/block-template/block-template.component";
import { data } from "jquery";
import { BlockUI, NgBlockUI } from "ng-block-ui";

@Component({
  selector: "app-add-update-appointment",
  templateUrl: "./add-update-appointment.component.html",
  styleUrls: ["./add-update-appointment.component.scss"],
})
export class AddUpdateAppointmentComponent implements OnInit {
  //View Variable
  @BlockUI() blockUI: NgBlockUI;
  blockTemplate: BlockTemplateComponent;
  moduleTitle: any;
  selected_date: any;
  selected_start_time: any;
  datePipe = new DatePipe("en-US");
  taxpreparerList: DataTax[];
  interval: any;
  is_event_title_form_view: boolean = true;
  edit_appointment_id: any;
  selected_site_id: any;
  calendar_start_date: Date;
  appointmentFormGroup = this.formBuilder.group({
    tax_preparer_id: ["", Validators.required],
    site_id: ["", Validators.required],
    client_name: ["", Validators.required],
    client_email: [""],
    client_phone_no: ["", Validators.required],
    client_address: [""],
    client_address2: [""],
    zip_code: [""],
    appointment_date: [""],
    appointment_start_time: [""],
    appointment_end_time: [""],
    time_interval: [""],
    meeting_type: ["", Validators.required],
    tax_type: ["", Validators.required],
    client_type: ["", Validators.required],
    is_landline: ["0"],
  });
  taxTypeList: TaxType[];
  orginalTaxTypeList: TaxType[];
  siteList: DataSite[];
  is_center_title_form_view: boolean = false;
  eventTypeList: EventType[] = [];
  citizenTypeList: CitizenType[];
  end_date_time: any;
  action: string;
  rescheduleCount: any;
  showPopup: boolean = false;
  is_event_date_range_form_view: boolean = false;
  remainingCount: number;
  taxInputByCitizenType: {};

  constructor(
    public dialogRef: MatDialogRef<AddUpdateAppointmentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    public sensez9Service: Sensez9Service,
    private formBuilder: FormBuilder
  ) {
    console.log("Data=", data);
    this.action = data.action;
    // this.moduleTitle = "Center name";
    if (data.action === "add_appointment") {
      this.selected_date = data.selected_date;
      if (data.selected_site_id != undefined) {
        if (data.selected_site_id != null) {
          this.selected_site_id = data.selected_site_id;
          this.appointmentFormGroup.controls["site_id"].setValue(
            this.selected_site_id
          );
        }
      }
      if (data.selected_date != undefined) {
        if (data.selected_date != null) {
          this.selected_date = data.selected_date;
        }
      }
    }
    if (data.action === "edit_appointment") {
      this.edit_appointment_id = data.object_id;
    }
  }

  ngOnInit() {
    // this.showPopup = false;

    this.eventTypeList = [
      { event_id: "0", event_name: "Meeting type" },
      { event_id: "1", event_name: "Physical" },
      { event_id: "2", event_name: "Virtual" },
    ];

    this.calendar_start_date = new Date();
    this.calendar_start_date.setDate(this.calendar_start_date.getDate() + 1);
    // if (this.selected_site_id == undefined) {
    //   this.getTax();
    // } else {
    //   this.getTaxPreparerById(this.selected_site_id, undefined);
    // }
    this.getTaxTypeList();
    // this.getSiteList();
    this.getCitizenType();
    if (this.action == "edit_appointment") {
      this.showPopup = true;
      this.getReScheduleCountByAppointmentId();
      this.getAppointmentDetail(this.edit_appointment_id);
    }
    if (this.action == "add_appointment") {
      if (this.selected_date == undefined) {
        this.selected_date = this.calendar_start_date;
      }
      console.log("this.selected_date", this.selected_date);
      this.appointmentFormGroup.controls["appointment_date"].setValue(
        this.selected_date
      );
      this.appointmentFormGroup.controls["appointment_start_time"].setValue(
        this.datePipe.transform(this.selected_date, "HH:mm")
      );
    }
  }

  getReScheduleCountByAppointmentId() {
    let input = {
      appointment_id: this.edit_appointment_id,
    };
    this.sensez9Service
      .getReScheduleCountByAppointmentId(input)
      .subscribe((resp) => {
        this.rescheduleCount = resp.body.obj;
        if (this.rescheduleCount != 0) {
          this.remainingCount = 3 - this.rescheduleCount;
        } else {
          setTimeout(() => {
            this.showPopup = false;
          }, 3000);
        }
      });
  }

  proceed() {
    this.showPopup = false;
  }

  selectCitizen(name, event) {
    let input = {};
    if (name == "Military") {
      input = {
        military: 1,
      };
    }
    if (name == "Regular") {
      input = {
        regular: 1,
      };
    }
    if (name == "Spanish") {
      input = {
        spanish: 1,
      };
    }
    if (name == "International") {
      input = {
        international: 1,
      };
    }
    this.taxInputByCitizenType = input;
    this.getSiteListById(input);
  }

  getSiteListById(input) {
    // this.siteInput = input;
    this.sensez9Service.getSiteListById(input).subscribe((resp) => {
      const siteResponse: SiteResponse = resp.body;
      this.siteList = siteResponse.obj;
    });
  }

  selectSite(name) {}
  getAllTaxPreparerById(inp, siteId) {
    let input = {
      site_id: siteId,
      taxType: inp,
      date: this.datePipe.transform(this.selected_date, "yyyy-MM-dd"),
    };
    this.sensez9Service.getAllTaxPreparersById(input).subscribe((resp) => {
      const taxPrepareResponse: TaxResponse = resp.body;
      this.taxpreparerList = taxPrepareResponse.obj;
    });
  }

  getTax() {
    let input: any = {};
    let currentUser = JSON.parse(localStorage.getItem("currentUser"));
    let added_by = currentUser.obj.user_id;
    input.user_id = added_by;
    this.sensez9Service.getAllTaxPreparers(input).subscribe((resp) => {
      const taxPrepareResponse: TaxResponse = resp.body;
      this.taxpreparerList = taxPrepareResponse.obj;
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
    input.date = this.datePipe.transform(this.selected_date, "yyyy-MM-dd");
    console.log("getTaxPreparerById Input Data", input);
    this.sensez9Service.getAllTaxPreparersById(input).subscribe((resp) => {
      const taxPrepareResponse: TaxResponse = resp.body;
      this.taxpreparerList = taxPrepareResponse.obj;
    });
  }

  getSiteList() {
    this.sensez9Service.getSiteList().subscribe((resp) => {
      const siteResponse: SiteResponse = resp.body;
      this.siteList = siteResponse.obj;
    });
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
      this.orginalTaxTypeList = taxResponse.obj;
    });
  }

  getCitizenType() {
    const loginResponse: LoginUserInterface = JSON.parse(
      localStorage.getItem("currentUser")
    );
    const loggedInUser = loginResponse.obj;
    let input = { user_id: loggedInUser.user_id };
    this.sensez9Service.getCitizenType().subscribe((response) => {
      const taxResponse: CitizenTypeResponse = response.body;
      this.citizenTypeList = taxResponse.obj;
    });
  }

  addUpdateForm() {
    console.log("addUpdateForm", "Add Form submitted");
    console.log("Add Form", this.appointmentFormGroup.value);
    this.appointmentFormGroup.markAllAsTouched();

    this.appointmentFormGroup.controls["appointment_date"].setValue(
      this.datePipe.transform(new Date(this.selected_date), "yyyy-MM-dd")
    );
    this.appointmentFormGroup.controls["appointment_start_time"].setValue(
      this.datePipe.transform(new Date(this.selected_date), "HH:mm:ss")
    );
    if (this.end_date_time != undefined) {
      this.appointmentFormGroup.controls["appointment_end_time"].setValue(
        this.datePipe.transform(new Date(this.end_date_time), "HH:mm:ss")
      );
    }
    if (this.interval != undefined) {
      this.appointmentFormGroup.controls["time_interval"].setValue(
        this.interval
      );
    }

    //edit appointment
    if (this.appointmentFormGroup.valid) {
      if (this.action == "edit_appointment") {
        this.blockUI.start("Please wait...");
        this.appointmentFormGroup.value.appointment_id =
          this.edit_appointment_id;
        let input = this.appointmentFormGroup.value;
        this.sensez9Service.editAppointment(input).subscribe((response) => {
          const result: NormalResponse = response.body;

          if (result.status == 200) {
            setTimeout(() => {
              this.blockUI.stop();
              this.dialogRef.close({
                event: "edit_appointment",
                isUpdated: true,
              });
            }, 2500);
          }
        });
      } else {
        this.blockUI.start("Please wait...");
        let input = this.appointmentFormGroup.value;
        console.log("FormData=", this.appointmentFormGroup.value);
        this.sensez9Service.addAppointment(input).subscribe((response) => {
          const result: NormalResponse = response.body;
          if (result.status == 200) {
            setTimeout(() => {
              this.blockUI.stop();
              this.dialogRef.close({
                event: "add_appointment",
                isUpdated: true,
              });
            }, 2500);
          } else {
            this.blockUI.stop();
            this.openMessageDialog("message_dialog", "Alert", result.message);
          }
        });
      }
    }
  }

  checkExistingBooking(
    site_id: any,
    tax_prepare_id: any,
    start_date: any,
    start_time: any,
    end_time: any
  ) {
    let input: any = {};
    input.site_id = site_id;
    input.start_date = start_date;
    input.start_time = start_time;
    input.end_time = end_time;
    input.tax_prepare_id = tax_prepare_id;
    this.sensez9Service.checkExistingBooking(input).subscribe((response) => {
      const result: NormalResponse = response.body;
      if (result.status == 200) {
        if (this.action == "add_appointment") {
          this.addUpdateForm();
        }
        if (this.action == "edit_appointment") {
          this.addUpdateForm();
        }
      } else {
        this.openMessageDialog("message_dialog", "Alert", result.message);
      }
    });
  }

  selectTaxPrepare(event, tax_prepare_id: any) {
    if (event.isUserInput) {
      this.taxTypeList = [];
      console.log("selectTaxPrepare", tax_prepare_id);
      console.log("Size of TaxPrepare", this.taxpreparerList.length);
      this.taxpreparerList.forEach((element) => {
        if (element.preparer_id == tax_prepare_id) {
          if (element.taxType.document_drop_off == 1) {
            console.log("document_drop_off", "available");
            this.taxTypeList.push({
              id: 1,
              name: "Document Drop Off",
              extra_value: element.taxType.document_drop_off_time,
            });
          }
          if (element.taxType.basic_in_person == 1) {
            console.log("basic_in_person", "available");
            this.taxTypeList.push({
              id: 2,
              name: "Basic In Person",
              extra_value: element.taxType.basic_in_person_time,
            });
          }
          if (element.taxType.advance_in_person == 1) {
            console.log("advance_in_person", "available");
            this.taxTypeList.push({
              id: 3,
              name: "Advance in Person",
              extra_value: element.taxType.advance_in_person_time,
            });
          }
          if (element.taxType.return_visit == 1) {
            console.log("return_visit", "available");
            this.taxTypeList.push({
              id: 4,
              name: "Return Visit",
              extra_value: element.taxType.return_visit_time,
            });
          }
        }
      });
      console.log("TaxType", this.taxTypeList);
    }
  }

  selectTaxType(event, tax_type_id: any) {
    if (event.isUserInput) {
      this.taxTypeList.forEach((tax_type) => {
        if (tax_type.id == tax_type_id) {
          let value = tax_type.extra_value.substring(0, 2);
          this.interval = tax_type.extra_value;
          this.calculateEndDate();
        }
      });
    }
  }

  calculateEndDate() {
    if (this.interval != undefined && this.selected_date != undefined) {
      let value = this.interval.substring(0, 2);
      this.end_date_time = this.addMinutes(
        new Date(this.selected_date),
        Number(value)
      );
    }
  }

  addMinutes(date, minutes) {
    return new Date(date.getTime() + minutes * 60000);
  }

  get f() {
    return this.appointmentFormGroup.controls;
  }
  public hasError = (controlName: string, errorName: string) => {
    return this.appointmentFormGroup.controls[controlName].hasError(errorName);
  };

  public addRequiredValidator(controlName: string) {
    this.appointmentFormGroup.controls[controlName].setValidators(
      Validators.required
    );
    this.appointmentFormGroup.controls[controlName].updateValueAndValidity();
  }

  public clearValidators(controlName: string) {
    this.appointmentFormGroup.controls[controlName].clearValidators();
    this.appointmentFormGroup.controls[controlName].updateValueAndValidity();
  }

  open_field(flag: string) {
    if (flag == "client_name") {
      this.is_center_title_form_view = !this.is_center_title_form_view;
    }
    if (flag === "event_date_range") {
      this.is_center_title_form_view = false;
      this.is_event_date_range_form_view = !this.is_event_date_range_form_view;
    }
  }
  select_phone_type(phone_type: any) {
    console.log("phone_type", phone_type);
    if (phone_type == 1) {
      this.openMessageDialog(
        "message_dialog",
        "Alert",
        "You selected a landline number, So we need your email id for communication"
      );
      this.addRequiredValidator("client_email");
      this.clearValidators("client_phone_no");
    } else {
      this.addRequiredValidator("client_phone_no");
      this.clearValidators("client_email");
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

  getAppointmentDetail(appointment_id: any) {
    let input_parameter: any = {};
    input_parameter.appointment_id = appointment_id;
    this.sensez9Service
      .getAppointmentDetail(input_parameter)
      .subscribe((response) => {
        const appointmentResponse = response.body;
        const appointment: Appointment = appointmentResponse.obj;
        this.selected_date =
          appointment.appointment_date +
          " " +
          appointment.appointment_start_time;

        this.end_date_time =
          appointment.appointment_date + " " + appointment.appointment_end_time;

        this.interval = appointment.time_interval;
        this.appointmentFormGroup.controls["appointment_start_time"].setValue(
          this.selected_date
        );
        this.setFormData(appointment);
      });
  }

  setFormData(appointment: Appointment) {
    if (appointment != undefined) {
      if (appointment != null) {
        this.appointmentFormGroup.controls["tax_preparer_id"].setValue(
          appointment.tax_preparer_id
        );
        this.appointmentFormGroup.controls["site_id"].setValue(
          appointment.site_id
        );
        this.appointmentFormGroup.controls["client_name"].setValue(
          appointment.client_name
        );
        this.appointmentFormGroup.controls["client_email"].setValue(
          appointment.client_email
        );
        this.appointmentFormGroup.controls["client_phone_no"].setValue(
          appointment.client_phone_no
        );
        this.appointmentFormGroup.controls["client_address"].setValue(
          appointment.client_address
        );
        this.appointmentFormGroup.controls["client_address2"].setValue(
          appointment.client_address
        );
        this.appointmentFormGroup.controls["zip_code"].setValue(
          appointment.zip_code
        );
        this.appointmentFormGroup.controls["appointment_date"].setValue(
          this.datePipe.transform(this.selected_date, "yyyy-MM-dd")
        );
        this.appointmentFormGroup.controls["appointment_start_time"].setValue(
          appointment.appointment_start_time
        );
        this.appointmentFormGroup.controls["appointment_end_time"].setValue(
          appointment.appointment_end_time
        );
        this.appointmentFormGroup.controls["time_interval"].setValue(
          appointment.time_interval
        );
        this.appointmentFormGroup.controls["meeting_type"].setValue(
          String(appointment.meeting_type)
        );
        this.appointmentFormGroup.controls["tax_type"].setValue(
          appointment.tax_type
        );
        this.appointmentFormGroup.controls["client_type"].setValue(
          Number(appointment.client_type)
        );
        this.appointmentFormGroup.controls["is_landline"].setValue(
          String(appointment.is_landline)
        );
      }
    }
  }

  modelChangeFn(e, field_name: string) {
    // console.log("modelChangeFn called");
    // console.log("modelChangeFn called", this.selected_date);
    // console.log("Input called", e);
    if (field_name === "event_start_date_range") {
      if (this.selected_date != undefined) {
        let currentDate = new Date(e);
        console.log("modelChangeFn iF called", this.selected_date);
        this.selected_date = new Date(this.selected_date);
        currentDate.setHours(this.selected_date.getHours());
        currentDate.setMinutes(this.selected_date.getMinutes());
        currentDate.setSeconds(this.selected_date.getSeconds());
        this.selected_date = currentDate;
      } else {
        this.selected_date = new Date(e);
      }

      // this.selected_date = new Date(e);
      this.calculateEndDate();
    }
    if (field_name === "event_start_time_range") {
      let time_array = e.split(":");
      let hour = Number(time_array[0]);
      let minute = Number(time_array[1]);
      let stringHour: string;
      let stringMinute: string;
      if (hour < 10) {
        stringHour = "0" + hour;
      } else {
        stringHour = String(hour);
      }

      if (minute < 10) {
        stringMinute = "0" + minute;
      } else {
        stringMinute = String(minute);
      }
      this.selected_start_time = stringHour + ":" + stringMinute + ":00";
      this.selected_date = new Date(
        this.datePipe.transform(this.selected_date, "yyyy-MM-dd") +
          " " +
          this.selected_start_time
      );

      console.log("Current Date", this.selected_date);
      this.calculateEndDate();
      // this.selected_date = new Date(e);
    }
  }
  selectCenter(event, id: any) {
    if (event.isUserInput) {
      this.selected_site_id = id;
      // this.getTaxPreparerById(this.selected_site_id, undefined);
      this.getAllTaxPreparerById(
        this.taxInputByCitizenType,
        this.selected_site_id
      );
    }
  }
}

export interface EventType {
  event_id: string;
  event_name: string;
}
