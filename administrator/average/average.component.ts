import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/user.service';
import { MatDialog } from '@angular/material';
import { DialogComponent } from 'src/app/administrator/dialog/dialog.component';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder } from '@angular/forms';
import { ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-average',
  templateUrl: './average.component.html',
  styleUrls: ['./average.component.css']
})
export class AverageComponent implements OnInit {
  surveyNames: any;
  surveyName: string;
  topics: any[];
  averagedata: any;
  touched: boolean;
  constructor(private fb: FormBuilder, private route: Router, private userService: UserService, public dialog: MatDialog) { }
  @ViewChild('table') table: ElementRef;
  ngOnInit() {
    this.userService.getAllSurveyName().subscribe(
      data => {
        this.surveyNames = (JSON.parse(data["data"]));
        console.log(this.surveyNames)

      }
    );
  }
  getResult() {
    console.log(this.surveyName);
    this.userService.getSurveyList(this.surveyName).subscribe(
      data => {
        this.averagedata = (JSON.parse(data["data"]));
        this.topics = this.averagedata.topics;
        console.log(this.averagedata)
        console.log(this.topics)

      }
    );
  }
  selectSurveyName(value) {
    this.surveyName = value;
    console.log(value);
    // this.touched = false;
  }
}


