import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatDialogConfig, MatDialog } from "@angular/material/dialog";
import {
  FormBuilder,
  Validators,
  AbstractControl,
  FormControl,
  FormGroup,
  ValidatorFn,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { MatDatepickerInputEvent } from "@angular/material/datepicker";
import { DatePipe } from "@angular/common";

@Component({
  selector: "app-tax-screening-message",
  templateUrl: "./tax-screening-message.component.html",
  styleUrls: ["./tax-screening-message.component.css"],
})
export class TaxScreeningMessageComponent implements OnInit {
  dialog_title: string;
  dialog_message: string;
  is_form_data: boolean;
  form_object_list: any[] = [];
  form_object: any = {
    field_label: "Cancel comment",
    field_input_type: "textarea",
    field_input_key: "cancelation_comments",
    field_validation: [{ validation_name: "required" }],
  };

  addFormGroup = this.formBuilder.group({});
  constructor(
    public dialogRef: MatDialogRef<TaxScreeningMessageComponent>,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,

    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.dialog_title = data.title;
    this.dialog_message = data.message;
  }

  ngOnInit(): void {
    this.is_form_data = false;
    this.form_object_list.push(this.form_object);
    this.createForm();
  }

  createForm() {
    let localFormGroup = this.formBuilder.group({});
    const validatorFuncations: ValidatorFn[] = [];
    this.form_object_list.forEach((field) => {
      if (field.field_validation.length > 0) {
        field.field_validation.forEach((validator) => {
          if (validator.validation_name === "required") {
            validatorFuncations.push(Validators.required);
          }
        });
      }
      // let absctactControl: AbstractControl;
      // absctactControl.setValidators(validatorFuncations);
      localFormGroup.addControl(
        field.field_input_key,
        new FormControl("", validatorFuncations)
      );
    });
    this.addFormGroup = localFormGroup;
    console.log("AddForm", this.addFormGroup);
  }
  get f() {
    return this.addFormGroup.controls;
  }
  public hasError = (controlName: string, errorName: string) => {
    return this.addFormGroup.controls[controlName].hasError(errorName);
  };
  stayOnThePage() {
    console.log("AddForm", this.addFormGroup.value);
    // this.router.navigate(["/tax-screening"]);
  }
}
