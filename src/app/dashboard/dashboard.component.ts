import { Component, OnInit, ViewChild, ElementRef} from "@angular/core";
import { ChartOptions } from "chart.js";
import { Color, BaseChartDirective } from "ng2-charts";
import { AsyncRequestService } from "@app/core/services/async-request.service";
import { AlertService } from "@app/shared/_services";
import * as moment from "moment";
import { DatePipe } from "@angular/common";
import { Route, Router } from "@angular/router";
import * as Chart from "chart.js";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
  host: {
    "(window:resize)": "onResize($event)"
  }
})
export class DashboardComponent implements OnInit {
  // @ViewChild(BaseChartDirective,{static: true}) public chart: BaseChartDirective;
  @ViewChild("myChart1", { static: true }) myChart1: ElementRef;
  @ViewChild("myChart2", { static: true }) myChart2: ElementRef;
  monthlyIncomeStatistics: any;
  upcomingSessions: any;
  overallStatistics: any;

  urlMonthlyIncomeStatistics: string = "tutor/dashboard/monthly-income";
  urlUpcomingSessions: string = "tutor/dashboard/upcoming-sessions";
  urlOverallStatistics: string = "tutor/dashboard/overall-statistics";
  urlSessionlisting: string = "tutor/dashboard/today-sessions";
  urlRequestlinsting: string = "tutor/manage-session-requests";
  yearsArr = [];
  sessionListing: any;
  requestListing: any;

  sessionNodataAlert: boolean = false;
  requestNodataAlert: boolean = false;
  countListing1: any;
  countListing2: any;
  max: number = 0;
  newChart1: Chart;
  newChart2: Chart;
  constructor(
    private asyncRequestService: AsyncRequestService,
    private alertService: AlertService,
    private router: Router
  ) {}

  monthlyIncome: any;
  monthlyAvgIncome: any;
  monthlyAvgIncomeYear: any;
  chart2Data: any;
  chart2Label: any;

  ngOnInit() {
    window.scroll(0, 0);
    if (window.location.pathname == "/tutor/dashboard") {
      this.fetchMonthlyIncomeStatistics();
      this.fetchUpcomingSessions({ type: "week" });
      this.fetchOverallStatistics();
      this.fetchsessionListing();
    }
  }

  fetchsessionListing(params = []) {
    const data = {
      startDate: moment().format("YYYY-MM-DD"),
      endDate: moment().format("YYYY-MM-DD"),
      session_change: "upcomingsession"
    };
    this.asyncRequestService.getRequest(this.urlSessionlisting, data).subscribe(
      async (response: any) => {
        this.countListing1 = response.data.length;
        if (response.data.length >= 1) {
          this.sessionNodataAlert = false;
          this.sessionListing = response.data;
        } else {
          this.sessionNodataAlert = true;
        }
      },
      (errorResponse: any) => {}
    );
  }
  fetchMonthlyIncomeStatistics(params = []) {
    this.asyncRequestService
      .getRequest(this.urlMonthlyIncomeStatistics, params)
      .subscribe(
        async (response: any) => {
          this.monthlyIncome = response.totalEarning;
          this.monthlyAvgIncomeYear = response.year;
          this.yearsArr = response.years;
          this.monthlyAvgIncome = response.average_income;
          this.chart2(response);
        },
        (errorResponse: any) => {}
      );
  }

 
  fetchUpcomingSessions(params: any = []) {
    this.asyncRequestService
      .getRequest(this.urlUpcomingSessions, params)
      .subscribe(
        (response: any) => {
          this.chart2Label = Object.keys(response);
          this.chart2Data = Object.values(response);
          this.chart1(response);
        },
        (errorResponse: any) => {}
      );
  }

  fetchOverallStatistics() {
    this.asyncRequestService.getRequest(this.urlOverallStatistics).subscribe(
      (response: any) => {
        this.overallStatistics = response;
      },
      (errorResponse: any) => {}
    );
  }

  getMonthlyIncomeStatisticsByYear(event: any) {
    let params: any = {
      year: event.target.value
    };
    // this.fetchMonthlyIncomeStatistics(params);
    this.asyncRequestService
      .getRequest(this.urlMonthlyIncomeStatistics, params)
      .subscribe(
        async (response: any) => {
          this.monthlyIncome = response.totalEarning;
          this.monthlyAvgIncomeYear = response.year;
          this.monthlyAvgIncome = response.average_income;
          this.yearsArr = response.years;
        },
        (errorResponse: any) => {}
      );
  }

  getUpcomingSessions(event: any) {
    let params: any = {
      type: event.target.value
    };
    // this.fetchUpcomingSessions(params);
    this.asyncRequestService
      .getRequest(this.urlUpcomingSessions, params)
      .subscribe((response: any) => {
        this.chart2Label = "";
        this.chart2Data = "";
        this.chart2Label = Object.keys(response);
        this.chart2Data = Object.values(response);
        this.chartUpdate(response, this.chart2Label, this.chart2Data);
      });
  }

  getSubjectName(array: any) {
    let value = JSON.parse(array);
    return value.name;
  }
  

  dateConverter(date, time) {
    return moment
      .utc(`${date} ${time}`, "MMM DD YYYY HH:mm:ss")
      .local()
      .format("hh:mm A");
  }

  dateConverter2(date) {
    return moment.utc(`${date}`, "YYYY-MM-DD HH:mm:ss ").format("MMM DD, YYYY");
  }

  target(el: HTMLElement) {
    el.scrollIntoView({ behavior: "smooth" });
  }

  navigateTo(value) {
    var data = {
      slug: value,
      sort: "recent"
    };
    this.router.navigate([`/tutor/ratings`], { queryParams: data });
  }

  getTooltipValue(id) {
    return this.alertService.tooltipValueSender(id);
  }

  public barChartOptions: ChartOptions = {
    legend: {
      display: false
    },
    responsive: true,
    maintainAspectRatio: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: {
      xAxes: [
        {
          barPercentage: 0.4,
          gridLines: {
            color: "rgba(0,0,0,0)",
            display: false
          },
          ticks: { display: true }
        }
      ],
      yAxes: [
        {
          gridLines: {
            color: "rgba(0, 0, 0, 0)"
          },
          ticks: { display: false }
        }
      ]
      // yAxes: [{ ticks: { min: 0, max: 180, display: false } }]
    },
    plugins: {
      datalabels: {
        anchor: "end",
        align: "end"
      }
    }
  };
  public barChartColors: Color[] = [{ backgroundColor: "#ffc211" }];

  public barChartLabels = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "July",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
  ];
  public barChartType = "bar";
  public barChartLegend = true;
  public barChartData = [{ data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] }];

  //  ================================= Upcoming Sessions =================================

  chartUpdate(response, label, data) {
    var ctx = this.myChart1.nativeElement.getContext("2d");
    this.newChart1.data.labels = [];
    this.newChart1.data.datasets.forEach(dataset => {
      dataset.data = [];
    });
    this.newChart1.update();
    for (var i = 0; i < label.length; i++) {
      this.newChart1.data.labels.push(label[i]);
    }
    this.newChart1.data.datasets.forEach(dataset => {
      for (var i = 0; i < data.length; i++) {
        dataset.data.push(data[i]);
      }
    });
    this.newChart1.options = {
      responsive: true,
      maintainAspectRatio: true,
      legend: {
        display: false
      },
      title: {
        display: true,
        text: " "
      },
      tooltips: {
        enabled: false
      },
      scales: {
        xAxes: [
          {
            display: true,
            barPercentage: 0.4,
            gridLines: {
              display: false
            }
          }
        ],
        yAxes: [
          {
            display: true,
            gridLines: {
              display: false
            },
            ticks: {
              display: false,
              beginAtZero: true,
              // stepSize: 10,
              fontSize: 14,
              fontFamily: "'Poppins', sans-serif"
            }
          }
        ]
      },
      animation: {
        duration: 0,
        onComplete: function() {
          var chartInstance = this.chart;
          ctx = chartInstance.ctx;
          ctx.font = Chart.helpers.fontString(
            Chart.defaults.global.defaultFontSize,
            Chart.defaults.global.defaultFontStyle,
            Chart.defaults.global.defaultFontFamily
          );
          ctx.textAlign = "center";
          ctx.textBaseline = "bottom";

          this.data.datasets.forEach(function(dataset, i) {
            var meta = chartInstance.controller.getDatasetMeta(i);
            meta.data.forEach(function(bar, index) {
              var data = dataset.data[index];
              if (data == 0) {
                ctx.fillText("", bar._model.x, bar._model.y - 5);
              } else {
                ctx.fillText(data, bar._model.x, bar._model.y - 5);
              }
            });
          });
        }
      },
      hover: {
        animationDuration: 0
      },
      plugins: {
        datalabels: {
          anchor: "end",
          align: "end"
        }
      }
    };
    this.newChart1.update();
  }

  chart1(response) {
    var ctx = this.myChart1.nativeElement.getContext("2d");
    this.newChart1 = new Chart(ctx, {
      type: "bar",
      data: {
        labels: this.chart2Label,
        datasets: [
          {
            backgroundColor: "#ffc211",
            data: this.chart2Data
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        title: {
          display: true,
          text: " "
        },
        legend: {
          display: false,
          position: "top",
          fullWidth: true,

          labels: {
            // fontColor: "#000000",
          }
        },
        tooltips: {
          enabled: false
        },
        scales: {
          xAxes: [
            {
              display: true,
              barPercentage: 0.4,
              gridLines: {
                display: false
              },
              ticks: {
                fontSize: 14,
                fontFamily: "'Raleway', sans-serif"
              }
            }
          ],
          yAxes: [
            {
              type: "linear",
              display: true,
              gridLines: {
                display: false
              },
              ticks: {
                display: false,
                beginAtZero: true,
                // stepSize: 10,
                fontSize: 12,
                fontFamily: "'Poppins', sans-serif"
              }
            }
          ]
        },
        animation: {
          duration: 0,
          onComplete: function() {
            var chartInstance = this.chart;
            ctx = chartInstance.ctx;
            ctx.font = Chart.helpers.fontString(
              Chart.defaults.global.defaultFontSize,
              Chart.defaults.global.defaultFontStyle,
              Chart.defaults.global.defaultFontFamily
            );
            ctx.textAlign = "center";
            ctx.textBaseline = "bottom";

            this.data.datasets.forEach(function(dataset, i) {
              var meta = chartInstance.controller.getDatasetMeta(i);
              meta.data.forEach(function(bar, index) {
                var data = dataset.data[index];
                if (data == 0) {
                  ctx.fillText("", bar._model.x, bar._model.y - 5);
                } else {
                  ctx.fillText(data, bar._model.x, bar._model.y - 5);
                }
              });
            });
          }
        },
        hover: {
          animationDuration: 0
        },
        plugins: {
          datalabels: {
            anchor: "end",
            align: "end"
          }
        }
      }
    });
  }

  monthlyChartUpdate(response, label, data) {
    var ctx = this.myChart2.nativeElement.getContext("2d");
    this.newChart2.data.labels = [];
    this.newChart2.data.datasets.forEach(dataset => {
      dataset.data = [];
    });
    this.newChart2.update();
    for (var i = 0; i < label.length; i++) {
      this.newChart2.data.labels.push(label[i]);
    }
    this.newChart2.data.datasets.forEach(dataset => {
      for (var i = 0; i < data.length; i++) {
        dataset.data.push(data[i]);
      }
    });
    this.newChart2.options = {
      responsive: true,
      maintainAspectRatio: true,
      legend: {
        display: false
      },
      title: {
        display: true,
        text: " "
      },
      tooltips: {
        enabled: false
      },
      scales: {
        xAxes: [
          {
            display: true,
            barPercentage: 0.4,
            gridLines: {
              display: false
            }
          }
        ],
        yAxes: [
          {
            display: true,
            gridLines: {
              display: false
            },
            ticks: {
              display: false,
              fontSize: 14,
              fontFamily: "'Poppins', sans-serif"
            }
          }
        ]
      },
      animation: {
        duration: 0,
        onComplete: function() {
          var chartInstance = this.chart;
          ctx = chartInstance.ctx;
          ctx.font = Chart.helpers.fontString(
            Chart.defaults.global.defaultFontSize,
            Chart.defaults.global.defaultFontStyle,
            Chart.defaults.global.defaultFontFamily
          );
          ctx.textAlign = "center";
          ctx.textBaseline = "bottom";

          this.data.datasets.forEach(function(dataset, i) {
            var meta = chartInstance.controller.getDatasetMeta(i);
            meta.data.forEach(function(bar, index) {
              var data = dataset.data[index];
              if (data == 0) {
                ctx.fillText("", bar._model.x, bar._model.y - 5);
              } else {
                ctx.fillText(data, bar._model.x, bar._model.y - 5);
              }
            });
          });
        }
      },
      hover: {
        animationDuration: 0
      },
      plugins: {
        datalabels: {
          anchor: "end",
          align: "end"
        }
      }
    };
    this.newChart2.update();
  }

  chart2(response) {
    var ctx = this.myChart2.nativeElement.getContext("2d");
    this.newChart2 = new Chart(ctx, {
      type: "bar",
      data: {
        datasets: [
          {
            backgroundColor: "#ffc211"
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        title: {
          display: true,
          text: " "
        },
        legend: {
          display: false,
          position: "top",
          fullWidth: true,

          labels: {
            // fontColor: "#000000",
          }
        },
        tooltips: {
          enabled: false
        },
        scales: {
          xAxes: [
            {
              display: true,
              barPercentage: 0.4,
              gridLines: {
                display: false
              }
             
            }
          ],
          yAxes: [
            {
              type: "linear",
              display: true,
              gridLines: {
                display: false
              },
              ticks: {
                display: false,
                fontSize: 14,
                fontFamily: "'Poppins', sans-serif"
              }
            }
          ]
        },
        animation: {
          duration: 0,
          onComplete: function() {
            var chartInstance = this.chart;
            ctx = chartInstance.ctx;
            ctx.font = Chart.helpers.fontString(
              Chart.defaults.global.defaultFontSize,
              Chart.defaults.global.defaultFontStyle,
              Chart.defaults.global.defaultFontFamily
            );
            ctx.textAlign = "center";
            ctx.textBaseline = "bottom";

            this.data.datasets.forEach(function(dataset, i) {
              var meta = chartInstance.controller.getDatasetMeta(i);
              meta.data.forEach(function(bar, index) {
                var data = dataset.data[index];
                if (data == 0) {
                  ctx.fillText("", bar._model.x, bar._model.y - 5);
                } else {
                  ctx.fillText(
                    "₹" + data.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                    bar._model.x,
                    bar._model.y - 5
                  );
                }
              });
            });
          }
        },
        hover: {
          animationDuration: 0
        },
        plugins: {
          datalabels: {
            anchor: "end",
            align: "end"
          }
        }
      }
    });
  }

  onResize(event) {
    this.newChart1.update();
    this.newChart2.update();
  }
}
