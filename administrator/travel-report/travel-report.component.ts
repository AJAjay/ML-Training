import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/user.service';
import { MatDialog } from '@angular/material';
import { DialogComponent } from '../dialog/dialog.component';
import * as XLSX from 'xlsx';
import { resetApplicationState } from '@angular/core/src/render3/instructions';

@Component({
  selector: 'app-travel-report',
  templateUrl: './travel-report.component.html',
  styleUrls: ['./travel-report.component.css']
})
export class TravelReportComponent implements OnInit {

  exportTable: boolean = false;
  allParticipants: void;
  touched: boolean;
  participants: any;
  topics: string[];
  participantData: any;
  surveyNames: any;
  resultForm: FormGroup;
  participant: string;
  surveyName: string;
  selected: number = 0;
  survey_name: FormControl;
  participant_name: FormControl;
  objectKeys = Object.keys;
  average: number[];
  fromDate: FormControl;
  toDate: FormControl;
  qwe='surveyname';
  displayData: any;
  // @ViewChild("surveyName") surveyElement: ElementRef;
  // @ViewChild("participantName") participantElement: ElementRef;

  sliderValue = ["Poor", "Need Improvement", "Satisfactory", "Good", "VeryGood"];

  constructor(private fb: FormBuilder, private route: Router, private userService: UserService, public dialog: MatDialog) { }
  @ViewChild('table') table: ElementRef;
  ngOnInit() {
    this.average = [];
    console.log(this.average);
    this.topics = ["Employee Name"];
    this.fromDate = new FormControl();
    this.toDate = new FormControl();
    this.survey_name = new FormControl('', [Validators.required]);
    this.participant_name = new FormControl('', [Validators.required]);
    this.userService.getAllSurveyName().subscribe(
      data => {
        this.surveyNames = (JSON.parse(data["data"]));
      }
    );
  }
  getResult() {
    if (this.surveyName == undefined || this.participant == undefined) {
      this.dialog.open(DialogComponent, { data: { heading: "Select all the fields" } });
    }
    else {
      this.topics = ["Employee Name"];
      this.average = [];
      this.exportTable = true;
      if (this.participant == "All Participants") {
        this.userService.getAllParticipants(this.surveyName).subscribe(
          data => {            
            if (this.participants.length == 1) {
              this.participants = undefined;
              this.displayData = undefined;
              return;
            }
            this.participantData = (JSON.parse(data["data"]));
            console.log(this.participantData);
            this.participantData.map(res => {
              res["userID"] = res["userID"].split(".")[0];
            });
            this.displayData = this.participantData;
            if (this.participantData.length > 0) {
              let allTopics = this.participantData[0]["topics"];
              for (let i = 0; i < allTopics.length; i++) {
                this.topics.push(allTopics[i]["topic"]);
              }
              this.calculateAverage();
              this.sortOnDate();
            }

          });
      }
      else {
        this.userService.participantWiseResult(this.surveyName, this.participant).subscribe(
          data => { 
            if (this.participants.length == 1) {
              this.participants = undefined;
              this.displayData = undefined;
              return;
            }
            this.participantData = (JSON.parse(data["data"]));
            this.participantData.map(res => {
              res["userID"] = res["userID"].split("@")[0];
            });
            this.displayData = this.participantData;
            if (this.participantData.length > 0) {
              let allTopics = this.participantData[0]["topics"];
              for (let i = 0; i < allTopics.length; i++) {
                this.topics.push(allTopics[i]["topic"]);
              }
              this.calculateAverage();
              this.sortOnDate();
            }
          }
        );
      }
    }
  }
  selectSurveyName(value: string) {
    this.surveyName = value;
    console.log(typeof this.surveyName);
    this.touched = false;
    this.fromDate.reset();
    this.toDate.reset();
    this.userService.getParticipant(value).subscribe(
      data => {
        this.participants = (JSON.parse(data["data"]));
        if (this.participants == undefined) {
          this.participants = undefined;
          this.displayData = undefined;
          return;
        }
        this.participants.map(p => {
          p["selected"] = false;
        });
        this.participants.push({ userID: "All Participants", selected: true });
        for (let i = 0; i < this.participants.length-1; i++) {
          for (let j = i + 1; j < this.participants.length; ) {
            if (this.participants[i].userID == this.participants[j].userID) {
              this.participants.splice(j, 1);
            }
            else {
              j++;
            }
          }
        }
        this.participant = this.participants[this.participants.length - 1]["userID"];
      });
  }
  selectParticipant(value) {
    this.touched = true;
    this.participant = value;
    // this.fromDate.reset();
    // this.toDate.reset();
    // this.getResult();
  }
  ExportToExcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.table.nativeElement);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, 'SP_Travel_Report.xlsx');

  }

  calculateAverage(): void {
    this.average = [];
    let avg: Array<Array<number>> = [];
    for (let i = 0; i < this.topics.length - 1; i++) { // topics
      for (let j = 0; j < this.displayData.length; j++) {
        let pDetails = this.displayData[j]["topics"];
        for (let k = 0; k < pDetails.length; k++) {
          if (avg[i] == undefined) {
            avg[i] = [];
          }
          avg[i].push(+pDetails[i].sliderAverage);
          break;
        }
      }
      if (avg.length > 0) {
        this.average.push(this.calculateAverageForAColumn(avg[i]));
      }
      console.log(this.average);
    }
  }

  calculateAverageForAColumn(column: Array<number>): number {
    let sum = 0;
    for (let i = 0; i < column.length; i++) {
      sum += column[i];
    }
    return sum / column.length;
  }

  calculateOverallAverage(column: Array<number>): number {
    let sum: number = 0;
    let validLength: number = 0;
    for (let i = 0; i < column.length; i++) {
      if (column[i] == 0) {
        continue;
      }
      sum += column[i];
      validLength++;
    }
    return sum / validLength;
  }

  sortOnDate() {
    // if(this.surveyElement.nativeElement.value == 'selectHere' || this.participantElement.nativeElement.value == 'selectHere') {
    //   this.dialog.open(DialogComponent, { data: { heading: "Select survey name and participant name before selecting dates" } });
    //   return;
    // }
    console.log(1);
    if (this.fromDate.value != null && this.toDate.value != null) {
      let startDate: any = Date.parse(this.fromDate.value);
      let endDate: any = Date.parse(this.toDate.value);
      if (startDate > endDate) {
        this.displayData = undefined;
        this.dialog.open(DialogComponent, { data: { heading: "From date should be less than To date" } });
        return;
      }
      this.displayData = this.participantData.filter((participant) => {
        return ((Date.parse(participant["submitted_date"]) >= startDate) && (Date.parse(participant["submitted_date"]) <= endDate));
      });
      if (this.displayData.length > 0) {
        this.calculateAverage();
      } else {
        this.displayData = undefined;
        this.dialog.open(DialogComponent, { data: { heading: "No participants took the survey between the given dates" } });
      }
    }
  }

}
