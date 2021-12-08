import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

export interface Element {
  sr_no :string,
  web_lead_id :string,
  customer_name:string,
  city:string,
  new_lead_date:string,
  occupation:string,
  primary_source:string,
  secondary_source:string,
  status:string

}

const Lead_Data: Element[] = [
  { sr_no: '01', 
  web_lead_id: 'Leaf Sathi', 
  customer_name: 'Omkar Singh', 
  city: 'Rajkot' ,
  new_lead_date:'2021-10010 23:06:12',
  occupation:'Self Employed',
  primary_source:'Digital',
  secondary_source:'Web-landing-hindi',
  status:'Negative'
},

{ sr_no: '02', 
web_lead_id: 'Leaf Sathi', 
customer_name: 'Omkar Singh', 
city: 'Rajkot' ,
new_lead_date:'2021-10010 23:06:12',
occupation:'Self Employed',
primary_source:'Digital',
secondary_source:'Web-landing-hindi',
status:'Negative'
},

{ sr_no: '03', 
web_lead_id: 'Leaf Sathi', 
customer_name: 'Omkar Singh', 
city: 'Rajkot' ,
new_lead_date:'2021-10010 23:06:12',
occupation:'Self Employed',
primary_source:'Digital',
secondary_source:'Web-landing-hindi',
status:'Negative'
},

{ sr_no: '04', 
web_lead_id: 'Leaf Sathi', 
customer_name: 'Omkar Singh', 
city: 'Rajkot' ,
new_lead_date:'2021-10010 23:06:12',
occupation:'Self Employed',
primary_source:'Digital',
secondary_source:'Web-landing-hindi',
status:'Negative'
},

];

@Component({
  selector: 'app-screen1',
  templateUrl: './screen1.component.html',
  styleUrls: ['./screen1.component.css']
})
export class Screen1Component implements OnInit {

  displayedColumns = [
    'sr_no',
    'web_lead_id',
    'customer_name',
    'city',
    'new_lead_date',
    'occupation',
    'primary_source',
    'secondary_source',
    'status',
  ];
  // dataSource = Lead_Data;
  dataSource = new MatTableDataSource<Element>(Lead_Data);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  pageLength = 100;
  pageSize = 10;
  pageChangeEvent(event) {}

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

}
