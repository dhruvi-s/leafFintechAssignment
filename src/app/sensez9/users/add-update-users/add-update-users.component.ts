import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators, AbstractControl } from '@angular/forms';
import {FormControl} from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Overlay } from '@angular/cdk/overlay';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { Sensez9Service } from 'app/sensez9/sensez9.service';


@Component({
  selector: 'app-add-update-users',
  templateUrl: './add-update-users.component.html',
  styleUrls: ['./add-update-users.component.css']
})
export class AddUpdateUsersComponent implements OnInit {
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


  usersAddForm = this.formBuilder.group({
    username : ['', Validators.required],
    password:['', Validators.required],
    first_name:['', Validators.required],
    last_name: ['', Validators.required],
    zip_code: ['', Validators.required],
    contact_no: ['', Validators.required],
    email: ['', Validators.required],
    level: ['', Validators.required],
    sites:['', Validators.required],
    created_by:['']
    // site: this.formBuilder.array([]),

  });

  usersEditForm = this.formBuilder.group({
    username : ['', Validators.required],
    password:['', Validators.required],
    first_name:['', Validators.required],
    last_name: ['', Validators.required],
    zip_code: ['', Validators.required],
    contact_no: ['', Validators.required],
    email: ['', Validators.required],
    level: ['', Validators.required],
    sites:['', Validators.required],
    created_by:[''],
  });

  updateData: any;
  allUserRolesResp: any;
  allSitesResp: any;
  role: any;
  site: any;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private overlay: Overlay,
    public sensez9Service: Sensez9Service,
  ) { }

  ngOnInit(): void {
    this.getAllUserRoles();
    this.getAllSites();
    if( this.route.snapshot.params.update == "true"){
      this.isUpdate = true;
      this.updateData =  this.route.snapshot.params
      this.role = this.updateData.level;
      const usingSplit = this.updateData.site.split(',');
       usingSplit.pop();
      this.site=  usingSplit,

      this.usersEditForm.setValue({
        username:this.updateData.username,
        password:this.updateData.password,
        first_name: this.updateData.first_name,
        last_name:this.updateData.last_name,
        zip_code: this.updateData.zip_code,
        contact_no:this.updateData.contact_no,
        email: this.updateData.email,
        level:this.updateData.level,
        sites:this.updateData.site,
        created_by:this.updateData.created_by,
      })
    }
    else {
      this.isUpdate = false;
    }

  }

  getAllUserRoles() {
    this.sensez9Service.getUserRoles().subscribe(
      (resp) => {
        this.allUserRolesResp = resp.obj;
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

  back(){
    this.router.navigate(['/users']);
  }

  updateUsers(){
    this.usersEditForm.value.user_id = this.updateData.user_id
    interface Site {
      site_id: number;
      site_name: string;
    }
    let site = [] 
    this.allSitesResp.forEach(element => {
      this.usersEditForm.value.sites.forEach(element1 => { 
        if(element1 == element.site_name){ 
          let sitedata = {} as Site;
              console.log(element.site_id+"--"+element.site_name);
              sitedata.site_id = element.site_id;
              sitedata.site_name = element.site_name;
              site.push(sitedata)     
        }
      });
    });
    this.usersEditForm.value.sites=site

    this.sensez9Service.updateUsers(this.usersEditForm.value).subscribe(
      (resp) => {
        if(resp.status == 200){
          this.router.navigate(['/users']);
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

  addUsers(){
    interface Site {
      site_id: number;
      site_name: string;
    }
    let site = [] 
    this.allSitesResp.forEach(element => {
      this.usersAddForm.value.sites.forEach(element1 => { 
        if(element1 == element.site_id){ 
          let sitedata = {} as Site;
              console.log(element.site_id+"--"+element.site_name);
              sitedata.site_id = element.site_id;
              sitedata.site_name = element.site_name;
              site.push(sitedata)     
        }
      });
    });
    this.usersAddForm.value.sites=site
    this.usersAddForm.value.created_by=1
    //console.log(this.usersAddForm.value)
    this.sensez9Service.addUsers(this.usersAddForm.value).subscribe(resp => {
      if(resp.status == 200){
        this.router.navigate(['/users']);
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
    })
  }


  public hasError = (controlName: string, errorName: string) => {
    return this.usersAddForm.controls[controlName].hasError(errorName);
  }

  public hasError1 = (controlName: string, errorName: string) => {
    return this.usersEditForm.controls[controlName].hasError(errorName);
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

}
