import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/user.service';
import { MatDialog } from '@angular/material';
import { DialogComponent } from '../dialog/dialog.component';
import { ChangeDetectorRef } from '@angular/core';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-travel-comments-report',
  templateUrl: './travel-comments-report.component.html',
  styleUrls: ['./travel-comments-report.component.css']
})
export class TravelCommentsReportComponent implements OnInit {

  exportTable: boolean = false;
  allParticipants: void;
  touched: boolean;
  participants: any;
  questions: string[];
  answers: Array<Array<string>>
  selectedAnswers: Array<Array<string>>
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
  displayData: any;
  totalSize: number = 5;
  sizes: any = [5, 10, 15, 25, 50, 100, "All"];
  @ViewChild("surveyName") surveyElement: ElementRef;
  @ViewChild("participantName") participantElement: ElementRef;

  sliderValue = ["Poor", "Need Improvement", "Satisfactory", "Good", "VeryGood"];
  clearfDate: any;
  cleartDate: any;

  constructor(private fb: FormBuilder, private route: Router, private cdRef: ChangeDetectorRef, private userService: UserService, public dialog: MatDialog) { }
  @ViewChild('table') table: ElementRef;
  ngOnInit() {
    this.average = [];
    console.log(this.average);
    this.questions = ["Employee Name"];
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
      this.questions = ["Employee Name"];
      this.average = [];
      this.answers = [];
      this.selectedAnswers = [];
      this.exportTable = true;
      if (this.participant == "All Participants") {
        this.userService.getAllParticipants(this.surveyName).subscribe(
          data => {

            if (this.participants == undefined) {
              this.questions.pop();
              this.participants = undefined;
              this.selectedAnswers = undefined;
              this.answers = undefined;
              return;
            }
            this.participantData = (JSON.parse(data["data"]));
            console.log(this.participantData);
            this.participantData.map(res => {
              res["userID"] = res["userID"].split(".")[0];
            });
            this.displayData = this.participantData;
            if (this.participantData.length > 0) {
              let allGeneral = this.participantData[0]["general"];
              console.log(allGeneral, ": All General");
              if (allGeneral != undefined || allGeneral != null) {
                for (let i = 0; i < allGeneral.length; i++) {
                  this.questions.push("General - " + allGeneral[i]["question"]);
                }
              }
              let allTopics = this.participantData[0]["topics"];
              allTopics.map(at => {
                at["questions"].map(atq => {
                  this.questions.push(at["topic"] + " - " + atq["question"]);
                });
              });
              console.log(this.questions);
              this.fetchAnswers();
              this.sortOnDate();
            }

          });
      }
      else {
        this.userService.participantWiseResult(this.surveyName, this.participant).subscribe(
          data => {

            if (this.participants == undefined) {
              this.questions.pop();
              this.participants = undefined;
              this.selectedAnswers = undefined;
              this.answers = undefined;
              return;
            }
            this.participantData = (JSON.parse(data["data"]));
            console.log(this.participantData);
            this.participantData.map(res => {
              res["userID"] = res["userID"].split(".")[0];
            });
            this.displayData = this.participantData;
            if (this.participantData.length > 0) {
              let allGeneral = this.participantData[0]["general"];
              console.log(allGeneral, ": All General");
              if (allGeneral != undefined || allGeneral != null) {
                for (let i = 0; i < allGeneral.length; i++) {
                  this.questions.push("General - " + allGeneral[i]["question"]);
                }
              }
              let allTopics = this.participantData[0]["topics"];
              allTopics.map(at => {
                at["questions"].map(atq => {
                  this.questions.push(at["topic"] + " - " + atq["question"]);
                });
              });
              console.log(this.questions);
              this.fetchAnswers();
              this.sortOnDate();
            }
          }
        );
      }
    }
  }

  fetchAnswers() {
    this.answers = [];
    if (this.displayData.length > 0) {
      let names: string[] = [];
      this.displayData.map(disp => {
        let ans: string[] = [];
        ans.push(disp["userID"]);
        if (disp["general"] != null || disp["general"] != undefined)
          disp["general"].map(gen => {
            ans.push(gen["answer"]);
          });
        disp["topics"].map(at => {
          at["questions"].map(atq => {
            if (atq["question_type"] == "textField") {
              ans.push(atq["options"]);
            } else {
              // let finalAnswer: string = Object.keys(atq["options"])[0];
              let finalAnswer: string = "";
              if ("comment" in atq && atq["comment"].trim() != '') {
                // finalAnswer = finalAnswer + "( " + atq["comment"]+" )";
                finalAnswer = atq["comment"];
              } else {
                finalAnswer = "–";
              }
              ans.push(finalAnswer);
            }
          });
        });
        this.answers.push(ans);
      });
      this.selectedAnswers = this.answers;
    }
    console.log(this.answers);
  }

  selectSurveyName(value) {
    this.surveyName = value;
    this.touched = false;
    this.fromDate.reset();
    this.toDate.reset();
    this.userService.getParticipant(value).subscribe(
      data => {
        this.participants = (JSON.parse(data["data"]));
        if (this.participants.length == 0) {
          this.participants = undefined;
          return;
        }
        console.log(this.participants);
        this.participants.map(p => {
          p["selected"] = false;
        });
        this.participants.push({ userID: "All Participants", selected: true });
        for (let i = 0; i < this.participants.length - 1; i++) {
          for (let j = i + 1; j < this.participants.length;) {
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
    this.fromDate.reset();
    this.toDate.reset();
    // this.getResult();
  }
  ExportToExcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.table.nativeElement);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, 'SP_Travel_Comments_Report.xlsx');

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
        this.selectedAnswers = undefined;
        this.dialog.open(DialogComponent, { data: { heading: "From date should be less than To date" } });
        return;
      }
      this.displayData = this.participantData.filter((participant) => {
        return ((Date.parse(participant["submitted_date"]) >= startDate) && (Date.parse(participant["submitted_date"]) <= endDate));
      });
      if (this.displayData.length > 0) {
        this.fetchAnswers();
      } else {
        this.displayData = undefined;
        this.selectedAnswers = undefined;
        this.dialog.open(DialogComponent, { data: { heading: "No participants took the survey between the given dates" } });
      }
    }
  }
  ngAfterViewChecked() {
    console.log("Change Detected");
    this.cdRef.detectChanges();

  }

  print(value) {
    this.selectedAnswers = value;
  }

  sizeChange(size: any) {
    if (typeof size == "string" && size == 'All') {
      this.totalSize = this.participantData.length;
      console.log(this.totalSize);
      return;
    }
    this.totalSize = size;
  }
}
