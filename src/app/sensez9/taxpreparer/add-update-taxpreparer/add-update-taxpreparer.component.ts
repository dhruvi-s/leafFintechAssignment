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

export interface AllTime {
  value: string;
  viewValue: string;
}


@Component({
  selector: 'app-add-update-taxpreparer',
  templateUrl: './add-update-taxpreparer.component.html',
  styleUrls: ['./add-update-taxpreparer.component.css']
})
export class AddUpdateTaxpreparerComponent implements OnInit {
  @ViewChild('select') select: MatSelect;

  allSelected=false;
   foods: any[] = [
    {value: 'steak-0', viewValue: 'Steak'},
    {value: 'pizza-1', viewValue: 'Pizza'},
    {value: 'tacos-2', viewValue: 'Tacos'}
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
  isUpdate = false;
 isDiabled = false;
  // defaultBasicTime = [ '15 mins',  '15 mins']
  // defaultAdvanceTime = [ '15 mins',  '15 mins']
  // defaultReturnTime =[ '15 mins',  '15 mins']
  // defaultTime = [ '15 mins',  '15 mins']
  allTime: AllTime[] = [
    {value: '15 mins', viewValue: '15 mins'},
    {value: '20 mins', viewValue: '20 mins'},
    {value: '25 mins', viewValue: '25 mins'},
    {value: '30 mins', viewValue: '30 mins'},
    {value: '35 mins', viewValue: '35 mins'},
    {value: '40 mins', viewValue: '40 mins'},
    {value: '45 mins', viewValue: '45 mins'},
    {value: '50 mins', viewValue: '50 mins'},
    {value: '55 mins', viewValue: '55 mins'},
    {value: '60 mins', viewValue: '60 mins'},
  ];
basicTime: AllTime[] = [
    {value: '15 mins', viewValue: '15 mins'},
    {value: '20 mins', viewValue: '20 mins'},
    {value: '25 mins', viewValue: '25 mins'},
    {value: '30 mins', viewValue: '30 mins'},
    {value: '35 mins', viewValue: '35 mins'},
    {value: '40 mins', viewValue: '40 mins'},
    {value: '45 mins', viewValue: '45 mins'},
    {value: '50 mins', viewValue: '50 mins'},
    {value: '55 mins', viewValue: '55 mins'},
    {value: '60 mins', viewValue: '60 mins'},
  ];
advanceTime: AllTime[] = [
    {value: '15 mins', viewValue: '15 mins'},
    {value: '20 mins', viewValue: '20 mins'},
    {value: '25 mins', viewValue: '25 mins'},
    {value: '30 mins', viewValue: '30 mins'},
    {value: '35 mins', viewValue: '35 mins'},
    {value: '40 mins', viewValue: '40 mins'},
    {value: '45 mins', viewValue: '45 mins'},
    {value: '50 mins', viewValue: '50 mins'},
    {value: '55 mins', viewValue: '55 mins'},
    {value: '60 mins', viewValue: '60 mins'},
  ];
returnTime: AllTime[] = [
    {value: '15 mins', viewValue: '15 mins'},
    {value: '20 mins', viewValue: '20 mins'},
    {value: '25 mins', viewValue: '25 mins'},
    {value: '30 mins', viewValue: '30 mins'},
    {value: '35 mins', viewValue: '35 mins'},
    {value: '40 mins', viewValue: '40 mins'},
    {value: '45 mins', viewValue: '45 mins'},
    {value: '50 mins', viewValue: '50 mins'},
    {value: '55 mins', viewValue: '55 mins'},
    {value: '60 mins', viewValue: '60 mins'},
  ];

  taxAddForm = this.formBuilder.group({
    preparer_name : ['', Validators.required],
    preparer_contactno:[''],
    preparer_email:[''],
    preparer_zipcode: [''],
    status: [''],
    sites: ['', Validators.required],
    spanish: [''],
    international: [''],
    military: [''],
    document_drop_off:['', Validators.required],
    document_drop_off_time:[''],
    basic_in_person: ['', Validators.required],
    basic_in_person_time: [''],
    advance_in_person: ['', Validators.required],
    advance_in_person_time: [''],
    return_visit: ['', Validators.required],
    return_visit_time: [''],
  
    
  });

  taxEditForm = this.formBuilder.group({
    preparer_name : ['', Validators.required],
    preparer_contactno:[''],
    preparer_email:[''],
    preparer_zipcode: [''],
    status: ['', Validators.required],
    sites: ['', Validators.required],
    spanish: [''],
    international: [''],
    military: [''],
    document_drop_off:['', Validators.required],
    document_drop_off_time:[''],
    basic_in_person: ['', Validators.required],
    basic_in_person_time: [''],
    advance_in_person: ['', Validators.required],
    advance_in_person_time: [''],
    return_visit: ['', Validators.required],
    return_visit_time: [''],
  });



  updateData: any;
  allUserRolesResp: any;
  allSitesResp: any;
  site: any;
  documentDropOffTime: any;
  basicInPersonTime: any;
  advanceInPersonTime: any;
  returnVisitTime: any;
  isApprove = false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private overlay: Overlay,
    public sensez9Service: Sensez9Service,
  ) { }

  ngOnInit(): void {
    this.getAllSites();
    if( this.route.snapshot.params.update == "true"){
      this.isUpdate = true;
      this.isApprove = false;
      
      // this.updateData =  this.route.snapshot.params
      this.updateData = JSON.parse(localStorage.getItem('taxpreparer'));
      const usingSplit = this.updateData.site.split(',');
      usingSplit.pop();
      this.site=  usingSplit,     
      this.documentDropOffTime = this.updateData.taxType.document_drop_off_time,
      this.basicInPersonTime = this.updateData.taxType.basic_in_person_time,
      this.advanceInPersonTime = this.updateData.taxType.advance_in_person_time,
      this.returnVisitTime = this.updateData.taxType.return_visit_time
     
      this.taxEditForm.setValue({
        preparer_name : this.updateData.preparer_name,
        preparer_contactno:this.updateData.preparer_contactno,
        preparer_email:this.updateData.preparer_email,
        preparer_zipcode:this.updateData.preparer_zipcode,
        status: this.updateData.status,
        sites: this.updateData.site,
        spanish:this.updateData.taxType.spanish,
        international:this.updateData.taxType.international,
        military: this.updateData.taxType.military,
        document_drop_off:this.updateData.taxType.document_drop_off,
        basic_in_person: this.updateData.taxType.basic_in_person,
        advance_in_person:this.updateData.taxType.advance_in_person,
        return_visit: this.updateData.taxType.return_visit,
        document_drop_off_time:this.updateData.taxType.document_drop_off_time,
        basic_in_person_time:this.updateData.taxType.basic_in_person_time,
        advance_in_person_time:this.updateData.taxType.advance_in_person_time,
        return_visit_time:this.updateData.taxType.return_visit_time
      });
      console.log(this.taxEditForm.value);
    } 
    else if(this.route.snapshot.params.approve == "true"){
      this.isApprove = true;
      this.isUpdate = false;
      this.updateData = JSON.parse(localStorage.getItem('taxpreparer'));
      const usingSplit = this.updateData.site.split(',');
      usingSplit.pop();
      this.site=  usingSplit,
      this.documentDropOffTime = this.updateData.taxType.document_drop_off_time,
      this.basicInPersonTime = this.updateData.taxType.basic_in_person_time,
      this.advanceInPersonTime = this.updateData.taxType.advance_in_person_time,
      this.returnVisitTime = this.updateData.taxType.return_visit_time
     
      this.taxEditForm.setValue({
        preparer_name : this.updateData.preparer_name,
        preparer_contactno:this.updateData.preparer_contactno,
        preparer_email:this.updateData.preparer_email,
        preparer_zipcode:this.updateData.preparer_zipcode,
        status: this.updateData.status,
        sites: this.updateData.site,
        spanish:this.updateData.taxType.spanish,
        international:this.updateData.taxType.international,
        military: this.updateData.taxType.military,
        document_drop_off:this.updateData.taxType.document_drop_off,
        basic_in_person: this.updateData.taxType.basic_in_person,
        advance_in_person:this.updateData.taxType.advance_in_person,
        return_visit: this.updateData.taxType.return_visit,
        document_drop_off_time:this.updateData.taxType.document_drop_off_time,
        basic_in_person_time:this.updateData.taxType.basic_in_person_time,
        advance_in_person_time:this.updateData.taxType.advance_in_person_time,
        return_visit_time:this.updateData.taxType.return_visit_time
      });
    }
    else {
      this.isApprove = false;
      this.isUpdate = false;
    }

  }

  toggleAllSelection() {
    if (this.allSelected) {
      this.select.options.forEach((item: MatOption) => item.select());
    } else {
      this.select.options.forEach((item: MatOption) => item.deselect());
    }
  }

  optionClick() {
    let newStatus = true;
    this.select.options.forEach((item: MatOption) => {
      if (!item.selected) {
        newStatus = false;
      }
    });
    this.allSelected = newStatus;
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
    this.router.navigate(['/tax-preparer']);
  }

  approveTax(){
      this.taxEditForm.value.preparer_id = this.updateData.preparer_id;
      this.taxEditForm.value.status = 1;
      interface Site {
        site_id: number;
        site_name: string;
      }
      let site = [] 
      this.allSitesResp.forEach(element => {
        this.taxEditForm.value.sites.forEach(element1 => { 
          if(element1 == element.site_name){ 
            let sitedata = {} as Site;
                console.log(element.site_id+"--"+element.site_name);
                sitedata.site_id = element.site_id;
                sitedata.site_name = element.site_name;
                site.push(sitedata)     
          }
        });
      });
  
      interface taxType {
        document_drop_off: number;
        document_drop_off_time: String;
        basic_in_person: number;
        basic_in_person_time: string;
        advance_in_person: number;
        advance_in_person_time: string;
        return_visit:number;
        return_visit_time:string;
      }
      if(this.taxEditForm.value.document_drop_off==true){
        this.taxEditForm.value.document_drop_off=1
      }else{
        this.taxEditForm.value.document_drop_off=0
      } if(this.taxEditForm.value.basic_in_person==true){
        this.taxEditForm.value.basic_in_person=1
      }else{
        this.taxEditForm.value.basic_in_person=0
      } if(this.taxEditForm.value.advance_in_person==true){
        this.taxEditForm.value.advance_in_person=1
      }else{
        this.taxEditForm.value.advance_in_person=0
      } if(this.taxEditForm.value.return_visit==true){
        this.taxEditForm.value.return_visit=1
      }else{
        this.taxEditForm.value.return_visit=0
      }
      let taxType = {} as taxType;
      taxType.document_drop_off=this.taxEditForm.value.document_drop_off
      taxType.document_drop_off_time=this.taxEditForm.value.document_drop_off_time
      taxType.basic_in_person=this.taxEditForm.value.basic_in_person
      taxType.basic_in_person_time=this.taxEditForm.value.basic_in_person_time
      taxType.advance_in_person=this.taxEditForm.value.advance_in_person
      taxType.advance_in_person_time=this.taxEditForm.value.advance_in_person_time
      taxType.return_visit=this.taxEditForm.value.return_visit
      taxType.return_visit_time=this.taxEditForm.value.return_visit_time
      this.taxEditForm.value.sites=site
      this.taxEditForm.value.status=1
      this.taxEditForm.value.taxType=taxType
  
      console.log(this.taxEditForm.value)
      this.sensez9Service.updateTax(this.taxEditForm.value).subscribe(
        (resp) => {
          if(resp.status == 200){
            this.router.navigate(['/tax-preparer']);
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

  updateTax(){
    this.taxEditForm.value.preparer_id = this.updateData.preparer_id

    interface Site {
      site_id: number;
      site_name: string;
      preparer_id:number;
    }
    let site = [] 
    this.allSitesResp.forEach(element => {
      this.taxEditForm.value.sites.forEach(element1 => { 
        if(element1 == element.site_name){ 
          let sitedata = {} as Site;
              console.log(element.site_id+"--"+element.site_name);
              sitedata.site_id = element.site_id;
              sitedata.site_name = element.site_name;
              sitedata.preparer_id =  this.updateData.preparer_id;
              site.push(sitedata)     
        }
      });
    });

    interface taxType {
      document_drop_off: number;
      document_drop_off_time: String;
      basic_in_person: number;
      basic_in_person_time: string;
      advance_in_person: number;
      advance_in_person_time: string;
      return_visit:number;
      return_visit_time:string;
      preparer_id:number;
    }
    if(this.taxEditForm.value.document_drop_off==true){
      this.taxEditForm.value.document_drop_off=1
    }else{
      this.taxEditForm.value.document_drop_off=0
    } if(this.taxEditForm.value.basic_in_person==true){
      this.taxEditForm.value.basic_in_person=1
    }else{
      this.taxEditForm.value.basic_in_person=0
    } if(this.taxEditForm.value.advance_in_person==true){
      this.taxEditForm.value.advance_in_person=1
    }else{
      this.taxEditForm.value.advance_in_person=0
    } if(this.taxEditForm.value.return_visit==true){
      this.taxEditForm.value.return_visit=1
    }else{
      this.taxEditForm.value.return_visit=0
    }
    let taxType = {} as taxType;
    taxType.document_drop_off=this.taxEditForm.value.document_drop_off
    taxType.document_drop_off_time=this.taxEditForm.value.document_drop_off_time
    taxType.basic_in_person=this.taxEditForm.value.basic_in_person
    taxType.basic_in_person_time=this.taxEditForm.value.basic_in_person_time
    taxType.advance_in_person=this.taxEditForm.value.advance_in_person
    taxType.advance_in_person_time=this.taxEditForm.value.advance_in_person_time
    taxType.return_visit=this.taxEditForm.value.return_visit
    taxType.return_visit_time=this.taxEditForm.value.return_visit_time
    taxType.preparer_id =  this.updateData.preparer_id
    this.taxEditForm.value.sites=site
    this.taxEditForm.value.status=0
    this.taxEditForm.value.taxType=taxType

    console.log(this.taxEditForm.value)
    this.sensez9Service.updateTax(this.taxEditForm.value).subscribe(
      (resp) => {
        if(resp.status == 200){
          this.router.navigate(['/tax-preparer']);
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

  onSelectAll(e: any): void { 
    for (let i = 0; i < this.allSitesResp.length; i++) {
      const item = this.allSitesResp[i];
      item.is_selected = e;
    }
  }

 

  addTax(){
      //if level is 1 , 211 admin then automatically approve i.e status 1
      let currentUser = JSON.parse(localStorage.getItem("currentUser"));  
     
      console.log(this.allSelected);
    console.log( this.taxAddForm.value);
    interface Site {
      site_id: number;
      site_name: string;
    }
    let site = [] 
    this.allSitesResp.forEach(element => {
      this.taxAddForm.value.sites.forEach(element1 => { 
        if(element1 == element.site_id){ 
          let sitedata = {} as Site;
              console.log(element.site_id+"--"+element.site_name);
              sitedata.site_id = element.site_id;
              sitedata.site_name = element.site_name;
              site.push(sitedata)     
        }
      });
    });

    interface taxType {
      document_drop_off: number;
      document_drop_off_time: String;
      basic_in_person: number;
      basic_in_person_time: string;
      advance_in_person: number;
      advance_in_person_time: string;
      return_visit:number;
      return_visit_time:string;
    }
    if(this.taxAddForm.value.military==true){
      this.taxAddForm.value.military=1
    }else{
      this.taxAddForm.value.military=0
    }
    if(this.taxAddForm.value.spanish==true){
      this.taxAddForm.value.spanish=1
    }else{
      this.taxAddForm.value.spanish=0
    }
    if(this.taxAddForm.value.international==true){
      this.taxAddForm.value.international=1
    }else{
      this.taxAddForm.value.international=0
    }
    if(this.taxAddForm.value.document_drop_off==true){
      this.taxAddForm.value.document_drop_off=1
    }else{
      this.taxAddForm.value.document_drop_off=0
    } if(this.taxAddForm.value.basic_in_person==true){
      this.taxAddForm.value.basic_in_person=1
    }else{
      this.taxAddForm.value.basic_in_person=0
    } if(this.taxAddForm.value.advance_in_person==true){
      this.taxAddForm.value.advance_in_person=1
    }else{
      this.taxAddForm.value.advance_in_person=0
    } if(this.taxAddForm.value.return_visit==true){
      this.taxAddForm.value.return_visit=1
    }else{
      this.taxAddForm.value.return_visit=0
    }
    let taxType = {} as taxType;
    if(currentUser.level == '1'){
      this.taxAddForm.value.status == 1;
    } 
    else {
      this.taxAddForm.value.status=0;
    }
    taxType.document_drop_off=this.taxAddForm.value.document_drop_off
    taxType.document_drop_off_time=this.taxAddForm.value.document_drop_off_time == undefined ? 'NA' : this.taxAddForm.value.document_drop_off_time;
    taxType.basic_in_person=this.taxAddForm.value.basic_in_person
    taxType.basic_in_person_time=this.taxAddForm.value.basic_in_person_time  == undefined ? 'NA' : this.taxAddForm.value.basic_in_person_time ;
    taxType.advance_in_person=this.taxAddForm.value.advance_in_person
    taxType.advance_in_person_time=this.taxAddForm.value.advance_in_person_time  == undefined ? 'NA' : this.taxAddForm.value.advance_in_person_time;
    taxType.return_visit=this.taxAddForm.value.return_visit
    taxType.return_visit_time=this.taxAddForm.value.return_visit_time == undefined ? 'NA' : this.taxAddForm.value.return_visit_time;
    this.taxAddForm.value.sites=site
    
    this.taxAddForm.value.taxType=taxType
 
    this.sensez9Service.addTax(this.taxAddForm.value).subscribe(resp => {
      if(resp.status == 200){
        this.router.navigate(['/tax-preparer']);
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
    return this.taxAddForm.controls[controlName].hasError(errorName);
  }

  public hasError1 = (controlName: string, errorName: string) => {
    return this.taxEditForm.controls[controlName].hasError(errorName);
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
