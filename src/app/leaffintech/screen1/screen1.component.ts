import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DateModalComponent } from '../date-modal/date-modal.component';

declare var $: any;

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

{ sr_no: '05', 
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
  pageSize = 5;
  pageChangeEvent(event) {}

  constructor(
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
  }

  showDatePicker() {
    this.openDialog("dateModal", {}, null);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  openDialog(action: string, obj: any, element: any) {
    const dialogConfig = new MatDialogConfig();
    obj.action = action;
    obj.object_id = element;
    dialogConfig.backdropClass = "bdrop";
    dialogConfig.panelClass = "dialog-responsive";
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = obj;
    let dialogRef;
    if (action == "dateModal") {
      dialogRef = this.dialog.open(DateModalComponent, dialogConfig);
    }

  
    dialogRef.afterClosed().subscribe((result) => {
      if (result.event === "dateModal" && result.isUpdated === true) {
        this.showNotification(
          "bottom",
          "right",
          "success",
          "Date added successfully",
          "announcement"
        );
      }
      
    });
  }
  showNotification(from, align, color, stringMessage, icons) {
    const type = ["", "info", "success", "warning", "danger"];

    $.notify(
      {
        icon: icons,
        message: stringMessage,
      },
      {
        type: type[color],
        timer: 4000,
        placement: {
          from: from,
          align: align,
        },
        template:
          '<div data-notify="container" class="col-xl-4 col-lg-4 col-11 col-sm-4 col-md-4 alert alert-{0} alert-with-icon" role="alert">' +
          '<button mat-button  type="button" aria-hidden="true" class="close mat-button" data-notify="dismiss">  <i class="material-icons">close</i></button>' +
          '<i class="material-icons" data-notify="icon">notifications</i> ' +
          '<span data-notify="title">{1}</span> ' +
          '<span data-notify="message">{2}</span>' +
          '<div class="progress" data-notify="progressbar">' +
          '<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
          "</div>" +
          '<a href="{3}" target="{4}" data-notify="url"></a>' +
          "</div>",
      }
    );
  }

}
