import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, Validators, AbstractControl } from "@angular/forms";
import { FormControl } from "@angular/forms";
import { MatSelect } from "@angular/material/select";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { HttpErrorResponse } from "@angular/common/http";
import { DatePipe } from "@angular/common";
import { ActivatedRoute, Router } from "@angular/router";
import { Overlay } from "@angular/cdk/overlay";
import { MatDatepickerInputEvent } from "@angular/material/datepicker";
import { Sensez9Service } from "app/sensez9/sensez9.service";

@Component({
  selector: "app-add-update-site",
  templateUrl: "./add-update-site.component.html",
  styleUrls: ["./add-update-site.component.css"],
})
export class AddUpdateSiteComponent implements OnInit {
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
  isUpdate = false;

  siteAddForm = this.formBuilder.group({
    site_name: ["", Validators.required],
    zip_code: ["", Validators.required],
    address: ["", Validators.required],
    city: [""],
    county: ["" ],
    state: [""],
    virtual_only:["", ],
    advance:["", ],
    military:["", ],
    spanish:["", ],
    international:["", ],
    open_saturdays:["", ],

    

  });

  siteEditForm = this.formBuilder.group({
    site_name: ["", Validators.required],
    zip_code: ["", Validators.required],
    address: ["", Validators.required],
    city: [""],
    county: [""],
    state: [""],
    virtual_only:["", ],
    advance:["", ],
    military:["", ],
    spanish:["", ],
    international:["", ],
    open_saturdays:["", ],
   

  });

  updateData: any;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private overlay: Overlay,
    public sensez9Service: Sensez9Service
  ) {}
  // Get Current Location Coordinates

  ngOnInit(): void {
    if (this.route.snapshot.params.update == "true") {
      this.isUpdate = true;
      this.updateData = this.route.snapshot.params;

      this.siteEditForm.setValue({
        site_name: this.updateData.site_name,
        zip_code: this.updateData.zip_code,
        address: this.updateData.address,
        city:this.updateData.city,
        county:this.updateData.county,
        state:this.updateData.state,
        virtual_only:JSON.parse(this.updateData.virtual_only),
        advance:JSON.parse(this.updateData.advance),
        military:JSON.parse(this.updateData.military),
        spanish:JSON.parse(this.updateData.spanish),
        international:JSON.parse(this.updateData.international),
        open_saturdays:JSON.parse(this.updateData.open_saturdays),
    
      });
      console.log(this.siteEditForm.value);
    } else {
      this.isUpdate = false;
    }
    // this.setCurrentLocation();
  }

  back() {
    this.router.navigate(["/site"]);
  }

  updateSite() {
    this.siteEditForm.value.site_id = this.updateData.site_id;
    if(this.siteAddForm.value.open_saturdays==true){
      this.siteAddForm.value.open_saturdays=0
    }else{
      this.siteAddForm.value.open_saturdays=1
    }
    if(this.siteAddForm.value.virtual_only==true){
      this.siteAddForm.value.virtual_only=0
    }else{
      this.siteAddForm.value.virtual_only=1
    }
    if(this.siteAddForm.value.advance==true){
      this.siteAddForm.value.advance=0
    }else{
      this.siteAddForm.value.advance=1
    }
    if(this.siteAddForm.value.military==true){
      this.siteAddForm.value.military=0
    }else{
      this.siteAddForm.value.military=1
    }
    
    if(this.siteAddForm.value.international==true){
      this.siteAddForm.value.international=0
    }else{
      this.siteAddForm.value.international=1
    }
    
    if(this.siteAddForm.value.spanish==true){
      this.siteAddForm.value.spanish=0
    }else{
      this.siteAddForm.value.spanish=1
    }

    this.sensez9Service.updateSite(this.siteEditForm.value).subscribe(
      (resp) => {
        if (resp.status == 200) {
          this.router.navigate(["/site"]);
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

  addSite() {
    if(this.siteAddForm.value.open_saturdays==true){
      this.siteAddForm.value.open_saturdays=0
    }else{
      this.siteAddForm.value.open_saturdays=1
    }
    if(this.siteAddForm.value.virtual_only==true){
      this.siteAddForm.value.virtual_only=0
    }else{
      this.siteAddForm.value.virtual_only=1
    }
    if(this.siteAddForm.value.advance==true){
      this.siteAddForm.value.advance=0
    }else{
      this.siteAddForm.value.advance=1
    }
    if(this.siteAddForm.value.military==true){
      this.siteAddForm.value.military=0
    }else{
      this.siteAddForm.value.military=1
    }
    
    if(this.siteAddForm.value.international==true){
      this.siteAddForm.value.international=0
    }else{
      this.siteAddForm.value.international=1
    }
    
    if(this.siteAddForm.value.spanish==true){
      this.siteAddForm.value.spanish=0
    }else{
      this.siteAddForm.value.spanish=1
    }

    this.sensez9Service.addSite(this.siteAddForm.value).subscribe(
      (resp) => {
        if (resp.status == 200) {
          this.router.navigate(["/site"]);
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

  public hasError = (controlName: string, errorName: string) => {
    return this.siteAddForm.controls[controlName].hasError(errorName);
  };

  public hasError1 = (controlName: string, errorName: string) => {
    return this.siteEditForm.controls[controlName].hasError(errorName);
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
