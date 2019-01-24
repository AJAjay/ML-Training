import { Component, OnInit, Inject } from '@angular/core';

import { Chart } from 'chart.js';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DataServiceService } from 'src/app/administrator/data-service.service';
import { UserService } from 'src/app/user.service';
import { Router } from '@angular/router';
import { FormControl, Validators } from '@angular/forms'


@Component({
  selector: 'app-topics-dialog',
  templateUrl: './topics-dialog.component.html',
  styleUrls: ['./topics-dialog.component.css']
})
export class TopicsDialogComponent implements OnInit {

  topics: any;
  chartControl = new FormControl()
  types: string[] = ['bar', 'pie', 'line', 'doughnut'];
  myChart: Chart;
  constructor(public route: Router, public dialogRef: MatDialogRef<TopicsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private dataService: DataServiceService, private userService: UserService) { }

  ngOnInit() {
    
    this.chartControl = new FormControl('bar', [Validators.required]);
    this.createChart();
  }

  // pass the topics list to the next chart component
  passData() {
    this.dataService.addTopicList(this.data)
    this.route.navigate(['chart'])
    this.dialogRef.close();
  }
  //close Pop Up
  close() {
    this.dialogRef.close();
  }

  //create the chart 
  createChart() {
    let chart_data = {
      labels: this.data.lables,
      datasets: [
        {
          label: "",
          data: this.data.dataset,
          backgroundColor: [
            'rgba(54, 162, 235)',
            'rgba(255, 99, 132)',
            'rgba(75, 192, 192)',
            'rgba(153, 102, 255)',
            'rgba(255, 159, 64)',
            'rgba(255, 206, 86)'
          ]
        }]
    }
    let canvas = document.getElementById('result');
    if(this.myChart) this.myChart.destroy()
    let chart_type = this.chartControl.value;
    this.myChart = new Chart(canvas, {
      type:chart_type ,
      data: chart_data,
      options: {
        legend: {
          display: false
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
  }

}
