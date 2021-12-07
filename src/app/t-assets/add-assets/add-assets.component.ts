import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators, AbstractControl } from '@angular/forms';
import {FormControl} from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-add-assets',
  templateUrl: './add-assets.component.html',
  styleUrls: ['./add-assets.component.css']
})
export class AddAssetsComponent implements OnInit {

  assetsAddForm = this.formBuilder.group({
    asset_id : ['', Validators.required],
    beacon_id: ['', Validators.required],
    asset_type: ['', Validators.required],
    volume: ['', Validators.required],
    capacity_asset: [ , Validators.required],
    weight: ['', Validators.required],
  })

  // channels = new FormControl();

  constructor(
    public dialogRef: MatDialogRef<AddAssetsComponent>,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) 
    public data: any 
  ) { 

  }

  ngOnInit(): void {
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.assetsAddForm.controls[controlName].hasError(errorName);
  }
}
