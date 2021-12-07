import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { Appointment } from "app/screens/models/appointment";
import {
  CitizenType,
  CitizenTypeResponse,
} from "app/screens/models/citizen-type";
import { NormalResponse } from "app/screens/models/normal-response";
import { TaxType, TaxTypeResponse } from "app/screens/models/TaxType";
import { TaxScreeningMessageComponent } from "app/screens/tax-screening-message/tax-screening-message.component";
import { Sensez9Service } from "app/sensez9/sensez9.service";
import { DataSite, SiteResponse } from "app/sensez9/site/SiteResponse";
import {
  DataTax,
  TaxResponse,
} from "app/sensez9/taxpreparer/TaxPreparerResponse";
import { data } from "jquery";
import { AddUpdateAppointmentComponent } from "../add-update-appointment/add-update-appointment.component";

@Component({
  selector: 'app-edit-message',
  templateUrl: './edit-message.component.html',
  styleUrls: ['./edit-message.component.css']
})
export class EditMessageComponent implements OnInit {
  action: any;
  event: any;

  appointmentFormGroup = this.formBuilder.group({
    comments: ["", Validators.required],
  });
  selected_date: any;
  appointmentId: any;
  appointmentListById: any;

  constructor( public dialogRef: MatDialogRef<EditMessageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    public sensez9Service: Sensez9Service,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {
    console.log("Data=", data);
    this.event = data;
    this.action = data.action;
    this.appointmentId = data.object_id;
  
this.getAppointmentsByAppointmentId(this.appointmentId)
   }

  ngOnInit(): void {
    
  }

  getAppointmentsByAppointmentId(appointmentId){
    let input = {
      appointment_id:appointmentId,
    }
    this.sensez9Service.getAppointmentsByAppointmentId(input).subscribe(resp =>{
      this.appointmentListById = resp.body.obj
     
    })
  }



  get f() {
    return this.appointmentFormGroup.controls;
  }
  public hasError = (controlName: string, errorName: string) => {
    return this.appointmentFormGroup.controls[controlName].hasError(errorName);
  };

  deleteAppointment(){
    let input = {
      appointment_id:this.data.object_id,
    cancelation_comments:this.appointmentFormGroup.value.comments
    }
    this.sensez9Service.deleteAppointment(input).subscribe(resp =>{
      if (resp.status == 200) {
        this.dialogRef.close({ event: "edit_appointment", isUpdated: true });
      }
    })
    // data.object_id
  }

}
