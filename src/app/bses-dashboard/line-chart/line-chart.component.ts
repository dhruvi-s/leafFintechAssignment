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
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class LineChartComponent implements OnInit {
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
  lineChartData: any;
  dailyLineChartResp: any;
  dailyLineChartObj: any;

  constructor( 
    private route: ActivatedRoute,
    private router: Router,
    private overlay: Overlay,
    public dialog: MatDialog,
    public bsesService: BsesService,
    public dialogRef: MatDialogRef<LineChartComponent>,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any


  ) {
    const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear - 1, 11, 4);
    this.maxDate = new Date();

    this.lineChartData = data;

  }

  ngOnInit(): void {
    this.getDemo();
  }

  getDemo(){
    if(this.dailyLineChartObj != null) {
      this.dailyLineChartObj.destroy();
    }
    this.dailyLineChartObj = new Chart("canvasLine", {
      type: "line",
      data: {
        labels: [20,20,30,40,100],
        label:"Date",
        datasets: [
          {
            data: [20,20,20,20] ,
            label:
              "Attendance Completion by No. Of Days",
              
              borderColor: "#a4dce3",
              backgroundColor:"#a4dce3"
          },
        ],
      },
      options: {
        // pan: {
        //   enabled: true,
        //   mode: "x",
        // },
        // zoom: {
        //   drag: true,
        //   enabled: true,
        //   mode: "x",
        // },
        responsive: true,
        legend: {
          display: true,
        },
        scales: {
          xAxes: [
            {
              display: true,
            //  title: "date",
            scaleLabel: {
              display: true,
              labelString: 'Day'
            },
            },
          ],
          yAxes: [
            {
              display: true,
              ticks: {
                suggestedMin: 0,
                suggestedMax: 20,
              },
              scaleLabel: {
                display: true,
                labelString: 'Percentage'
              },
            },
          ],
        },
        annotation: {
          annotations: [
            {
              type: "line",
              mode: "horizontal",
              scaleID: "y-axis-0",
              // value:this.overviewDate,
              value:"",
              borderColor: "rgb(75, 192, 192)",
              borderWidth: 1,
              label: {
                enabled: false,
                content: "Lower Limit",
                position: "bottom",

                // Padding of label to add left/right, default below
                xPadding: 6,
                xAdjust: -10,

                // Padding of label to add top/bottom, default below
                yPadding: 6,
                // Font family of text, inherits from global
                fontFamily: "sans-serif",

                // Font size of text, inherits from global
                fontSize: 8,
              },
            },
            {
              type: "line",
              mode: "horizontal",
              scaleID: "y-axis-0",
              // optional annotation ID (must be unique)
              id: "a-line-1",
              // optional drawTime to control layering, overrides global drawTime setting
              drawTime: "afterDatasetsDraw",
              value:[20,20,60],
              borderColor: "rgb(75, 192, 192)",
              borderWidth: 1,
              label: {
                enabled: false,
                content: "Upper Limit",
                position: "top",

                // Padding of label to add left/right, default below
                xPadding: 6,
                xAdjust: -10,

                // Padding of label to add top/bottom, default below
                yPadding: 6,
                // Font family of text, inherits from global
                fontFamily: "sans-serif",

                // Font size of text, inherits from global
                fontSize: 8,
              },
            },
          ],
        },
        tooltips: {
          callbacks: {
              // labelColor: function(tooltipItem, chart) {
              //     return {
              //         borderColor: 'rgb(255, 0, 0)',
              //         backgroundColor: 'rgb(255, 0, 0)'
              //     };
              // },
            label: function(tooltipItem, data) {
             
                return  " Attendance Taken : " + tooltipItem.yLabel + " %";
            },
            title: function(tooltipItem, data) { 
              return "";
            },
            
          }  
        }
      },
    });
    this.startAnimationForLineChart(this.dailyLineChartObj);
  }

  getDailyLineChart(input){
    this.bsesService.getDailyLineChart(input).subscribe(resp => {
      this.dailyLineChartResp = resp.body.obj;
        if(this.dailyLineChartObj != null) {
        this.dailyLineChartObj.destroy();
      }
      this.dailyLineChartObj = new Chart("canvasLine", {
        type: "line",
        data: {
          labels: [20,20,30,40,100],
          label:"Date",
          datasets: [
            {
              data: [20,20,20,20] ,
              label:
                "Attendance Completion by No. Of Days",
                
                borderColor: "#a4dce3",
                backgroundColor:"#a4dce3"
            },
          ],
        },
        options: {
          // pan: {
          //   enabled: true,
          //   mode: "x",
          // },
          // zoom: {
          //   drag: true,
          //   enabled: true,
          //   mode: "x",
          // },
          responsive: true,
          legend: {
            display: true,
          },
          scales: {
            xAxes: [
              {
                display: true,
              //  title: "date",
              scaleLabel: {
                display: true,
                labelString: 'Day'
              },
              },
            ],
            yAxes: [
              {
                display: true,
                ticks: {
                  suggestedMin: 0,
                  suggestedMax: 20,
                },
                scaleLabel: {
                  display: true,
                  labelString: 'Percentage'
                },
              },
            ],
          },
          annotation: {
            annotations: [
              {
                type: "line",
                mode: "horizontal",
                scaleID: "y-axis-0",
                // value:this.overviewDate,
                value:"",
                borderColor: "rgb(75, 192, 192)",
                borderWidth: 1,
                label: {
                  enabled: false,
                  content: "Lower Limit",
                  position: "bottom",
  
                  // Padding of label to add left/right, default below
                  xPadding: 6,
                  xAdjust: -10,
  
                  // Padding of label to add top/bottom, default below
                  yPadding: 6,
                  // Font family of text, inherits from global
                  fontFamily: "sans-serif",
  
                  // Font size of text, inherits from global
                  fontSize: 8,
                },
              },
              {
                type: "line",
                mode: "horizontal",
                scaleID: "y-axis-0",
                // optional annotation ID (must be unique)
                id: "a-line-1",
                // optional drawTime to control layering, overrides global drawTime setting
                drawTime: "afterDatasetsDraw",
                value:[20,20,60],
                borderColor: "rgb(75, 192, 192)",
                borderWidth: 1,
                label: {
                  enabled: false,
                  content: "Upper Limit",
                  position: "top",
  
                  // Padding of label to add left/right, default below
                  xPadding: 6,
                  xAdjust: -10,
  
                  // Padding of label to add top/bottom, default below
                  yPadding: 6,
                  // Font family of text, inherits from global
                  fontFamily: "sans-serif",
  
                  // Font size of text, inherits from global
                  fontSize: 8,
                },
              },
            ],
          },
          tooltips: {
            callbacks: {
                // labelColor: function(tooltipItem, chart) {
                //     return {
                //         borderColor: 'rgb(255, 0, 0)',
                //         backgroundColor: 'rgb(255, 0, 0)'
                //     };
                // },
              label: function(tooltipItem, data) {
               
                  return  " Attendance Taken : " + tooltipItem.yLabel + " %";
              },
              title: function(tooltipItem, data) { 
                return "";
              },
              
            }  
          }
        },
      });
      this.startAnimationForLineChart(this.dailyLineChartObj);

  
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

  startAnimationForLineChart(chart) {
    let seq: any, delays: any, durations: any;
    seq = 0;
    delays = 0;
    durations = 0;

    chart.on("draw", function (data) {
      if (data.type === "line" || data.type === "area") {
        data.element.animate({
          d: {
            begin: 0,
            dur: 0,
            from: data.path
              .clone()
              .scale(1, 0)
              .translate(0, data.chartRect.height())
              .stringify(),
            to: data.path.clone().stringify(),
            easing: Chartist.Svg.Easing.easeOutQuint,
          },
        });
      } else if (data.type === "point") {
        seq++;
        data.element.animate({
          opacity: {
            begin: seq * delays,
            dur: durations,
            from: 0,
            to: 1,
            easing: "ease",
          },
        });
      }
    });

    seq = 0;
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
