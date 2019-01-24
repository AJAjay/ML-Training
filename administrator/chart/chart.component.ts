import { Component, OnInit } from '@angular/core';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { Chart } from 'chart.js';
import { UserService } from 'src/app/user.service';
import { DataServiceService } from 'src/app/administrator/data-service.service';
import { FormControl, Validators } from '@angular/forms'
import { MatDialog } from '@angular/material';
import { ShowRattingComponent } from '../show-ratting/show-ratting.component';
import { TopicsDialogComponent } from '../topics-dialog/topics-dialog.component';
import { DialogComponent } from '../dialog/dialog.component';
import { Manipulate } from '../collection'

interface OptionValue {
  option: string;
  value: number;
}
@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit {

  surveyResult: any;
  surveys: any;
  datalist: any[];
  labels: any[];
  viewTypes: string[] = ['Table', 'Chart'];
  types: string[] = ['bar', 'pie', 'line', 'doughnut'];
  numChart: any;
  topic: any;
  loader: boolean;
  chartControl: FormControl;
  topicControl: FormControl;
  viewControl: FormControl;
  fromDateControl: FormControl;
  toDateControl: FormControl;
  topicsList: string[];
  required_data: any;
  topic_index: number = 0;
  option_value: OptionValue[][] = [];
  topic_names: number[] = []
  topic_average: string[] = []
  manipulate: Manipulate;
  myChart: Chart[] = [];
  chart_len: number;

  ngOnInit() { }

  constructor(private userService: UserService, private dataService: DataServiceService, public dialog: MatDialog) {

    this.loader = true;
    this.manipulate = new Manipulate(this.userService);
    // Get all the Topics from DB
    this.dataService.topicListMessage.subscribe(message => {
      this.required_data = message;
      this.topicsList = this.takeTopicNames(this.required_data.topics);
      this.createForm();
    });

  }

  // Create Form for the DropDown
  createForm() {
    this.chartControl = new FormControl('bar', [Validators.required]);
    this.topicControl = new FormControl(this.topicsList[0], [Validators.required]);
    this.viewControl = new FormControl('Chart', [Validators.required]);
    this.fromDateControl = new FormControl();
    this.toDateControl = new FormControl();
    this.userService.showStatistics(this.required_data.user, this.required_data.surveyName).subscribe(
      data => {
        this.surveys = JSON.parse(data["data"])[0];
        this.surveyResult = this.surveys;
        // console.log(this.required_data.id)
        this.getChart();
      });
  }

  // Get Topic Name in an array
  takeTopicNames(topicsList): string[] {
    let names: string[] = [];
    for (let t of topicsList) {
      names.push(t.topic);
    }
    return names;
  }

  // Get chart for the specific topic
  getChart() {
    if (this.viewControl.value == "Chart")
      this.createChart(this.surveyResult);
    else
      this.getOptionsValue(this.surveyResult);
    this.topicwiseAverage()
  }

  questionType(index) {
    // console.log(this.surveyResult[0].questions[index].options);
    return this.numChart[index].question_type != "textField"
  }

  //creation of the chart
  createChart(surveyData) {
    this.loader = true;
    // console.log(surveyData)
    this.topic = surveyData.topics[this.topic_index];
    this.numChart = this.topic.questions;
    let chart_pos = 0;
    for (var i = 0; i < this.topic.questions.length; i++) {
      if (this.topic.questions[i].question_type != "textField") {
        this.labels = Object.keys(this.topic.questions[i].options);
        this.datalist = [];
        for (var j = 0; j < this.labels.length; j++) {
          this.datalist[j] = this.topic.questions[i].options[this.labels[j]];
        }
        let str = 'result' + i;
        let datas = {
          labels: this.labels,
          datasets: [
            {
              label: "",
              data: this.datalist,
              backgroundColor: [
                'rgba(255, 99, 132)',
                'rgba(54, 162, 235)',
                'rgba(255, 206, 86)',
                'rgba(75, 192, 192)',
                'rgba(153, 102, 255)',
                'rgba(255, 159, 64)',
                'rgba(255, 206, 86)'
              ],
              borderColor: [
                'rgba(255,99,132,1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
                'rgba(255, 206, 86,1)'
              ],
              borderWidth: 1

            }]
        }
        setTimeout(() => {
          let canvas = document.getElementById(str);
          let chartType = this.chartControl.value;
          if(this.myChart[chart_pos]) {
            this.myChart[chart_pos].destroy()
            console.log("this is executing")
          }
          this.myChart[chart_pos] = new Chart(canvas, {
            type: chartType,
            data: datas,
            options: {
              legend: {
                display: (chartType == "pie" || chartType == "doughnut") ? true : false
              },
              responsive: true,
              scales: {
                yAxes: [{
                  ticks: {
                    beginAtZero: true
                  }
                }]
              }

            }
          });
          this.loader = false;
          chart_pos++;
        }, 500)

      }

    }
  }

  //get the key and value for options
  getOptionsValue(surveyResult) {
    this.topic = surveyResult.topics[this.topic_index];
    this.numChart = this.topic.questions;
    this.loader = false;
    let index = 0;//to get the length of the option value
    for (let i = 0; i < this.topic.questions.length; i++) {

      if (this.topic.questions[i].question_type != 'textField') {
        this.option_value[index] = [];
        for (let key in this.topic.questions[i].options) {
          this.option_value[index].push({ option: key, value: this.topic.questions[i].options[key] });
        }
        index++;
      }
    }
  }

  // to get the topic 
  getTopic(index) {
    this.topic_index = index;
    this.createChart(this.surveyResult);
  }

  overallRating() {
    let average = this.surveyResult.average != null ? this.surveyResult.average : 0;
    this.dialog.open(ShowRattingComponent, { data: average });
  }

  topicwiseAverage() {
    this.topic_names = [];
    this.topic_average = [];
    for (let topics of this.surveyResult.topics) {
      if (topics.sliderAverage != null) {
        this.topic_names.push(topics.topic)
        this.topic_average.push(topics.sliderAverage)
      }
    }
  }

  overallGraph() {
    this.dialog.open(TopicsDialogComponent, { data: { name: this.surveyResult.surveyName, lables: this.topic_names, dataset: this.topic_average, info: false } });
  }

  sortOnDate(from, to) {
    let touched;
    touched = to == null || to.length < 1 ? false : true;
    if (touched) {
      if (from == null || to == null || from.length < 1 || to.length < 1) this.dialog.open(DialogComponent, { data: { heading: "Fill both date field" } });
      else {
        if (from > to) this.dialog.open(DialogComponent, { data: { heading: "From date less than To date" } });
        else this.surveysOnDate(from, to)
        console.log("started")
      }
    }
  }

  // to get the survey for required date
  surveysOnDate(from, to) {
    let surveys: any = null;
    console.log(from, to);
    this.userService.dateBased(from, to, this.required_data.id).subscribe(
      data => {
        surveys = JSON.parse(data["data"])
        console.log(surveys)
        if (surveys == null || surveys.length < 1) this.dialog.open(DialogComponent, { data: { heading: "No one attended in this time" } });
        else this.calculateData(surveys)
      }
    )
  }

  // calculateAverage()
  calculateData(records) {
    let result;
    this.userService.getDataTemplate(this.required_data.id).subscribe(
      data => {
        console.log(JSON.parse(data['data'])[0])
        result = this.manipulate.addFeedbacks(records, JSON.parse(data['data'])[0]);
        console.log(result)
        this.surveyResult = result
        this.getChart()
      }
    )
  }
  resetDate() {
    this.fromDateControl.reset();
    this.toDateControl.reset();
    this.surveyResult = this.surveys;
    this.getChart()
  }
}