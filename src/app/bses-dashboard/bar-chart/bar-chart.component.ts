import { Component, Inject, Input, OnInit, ViewChild } from "@angular/core";
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
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
import { PaginatedDataSource } from 'app/paging/paginated-datasource';
import { Sort } from 'app/paging/page';
import { animate, state, style, transition, trigger } from "@angular/animations";

import { trim } from "jquery";
import { Overlay } from "@angular/cdk/overlay";
import { BsesService } from "../bses.service";
import * as Chartist from "chartist";

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class BarChartComponent implements OnInit {

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
  barChartData: any;
  barChartResp: any;

  public chart: Chart;
  selectedMonth: string;

  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private overlay: Overlay,
    public dialog: MatDialog,
    public bsesService: BsesService,
    public dialogRef: MatDialogRef<BarChartComponent>,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any


  ) {
    const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear - 1, 11, 4);
    this.maxDate = new Date();

    this.barChartData = data;
    this.selectedMonth = this.pipe.transform(this.barChartData.start_date, "yyyy-MM-dd", "en-US");

 }

  ngOnInit(): void {
    this.loadSummary("init");
  }

  
  getBarChart(input){
    
    this.bsesService.getDailyBarChart(input).subscribe(resp => {
      this.barChartResp = resp.body.obj; 
      let barDataPoints = [];
      let barDataLabels = [];
      this.barChartResp.forEach(element => {
        barDataPoints.push(element.mins);
        // barDataPoints.push(this.pipe.transform(element.mins, "mm ", "en-US"));
        barDataLabels.push(this.pipe.transform(element.created_at, "HH:mm", "en-US"))
      });
      console.log(barDataPoints, barDataLabels )
      this.chart = new Chart("canvas", {
        type: "bar",
        data: {
          labels: barDataLabels,
          datasets: [
            {
              label: "Total Mins Of Outage" + ' : ' +  this.pipe.transform(this.today, "yyyy-MM", "en-US"),
              data: barDataPoints,
              backgroundColor: '#e86667', 
              borderColor:  '#e86667',
              borderWidth: 1,
              barThickness: 60,
            }
          ]
        },
        options: {
          scales: {
            xAxes: [{
              gridLines: {
                  color: "rgba(0, 0, 0, 0)",
              }
          }],
            yAxes: [
                {
                  display: true,
                  ticks: {
                    suggestedMin: 0,
                    suggestedMax:120,
                    stepSize:20,
                  },
                  scaleLabel: {
                    labelString: 'Total Minutes Of Outage' ,
                    display: true
                  }
                },
              
            ]
          }
        }
      });
    })

  
   
    
 

  }


  loadSummary(flag: any) {
    const now = this.today;
    const myFormattedDate = this.pipe.transform(now, "yyyy-MM-dd", "en-US");
    let currentUser = JSON.parse(localStorage.getItem("currentUser"));  
    
    let input = {
      start_date: this.barChartData.start_date,
      end_date: this.barChartData.end_date,
      device_id : this.barChartData.device_id
    };

    this.getBarChart(input);
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
