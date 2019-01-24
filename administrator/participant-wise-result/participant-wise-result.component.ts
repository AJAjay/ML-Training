import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/user.service';
import { MatDialog } from '@angular/material';
import { DialogComponent } from 'src/app/administrator/dialog/dialog.component';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder } from '@angular/forms';
import { ViewChild, ElementRef } from '@angular/core';
import * as XLSX from 'xlsx';


@Component({
  selector: 'app-participant-wise-result',
  templateUrl: './participant-wise-result.component.html',
  styleUrls: ['./participant-wise-result.component.css']
})
export class ParticipantWiseResultComponent implements OnInit {
  exportTable: boolean = false;
  allParticipants: void;
  touched: boolean;
  participants: any;
  topics: any;
  participantData: any;
  surveyNames: any;
  resultForm: FormGroup;
  participant: string;
  surveyName: string;
  selected: number = 0;
  survey_name: FormControl;
  participant_name: FormControl;
  objectKeys = Object.keys;

  sliderValue = ["Poor", "Need Improvement", "Satisfactory", "Good", "VeryGood"];

  constructor(private fb: FormBuilder, private route: Router, private userService: UserService, public dialog: MatDialog) { }
  @ViewChild('table') table: ElementRef;
  ngOnInit() {
    this.survey_name = new FormControl('', [Validators.required]);
    this.participant_name = new FormControl('', [Validators.required]);
    this.userService.getAllSurveyName().subscribe(
      data => {
        this.surveyNames = (JSON.parse(data["data"]));
      }
    );
  }
  getResult() {
    if (typeof this.surveyName == 'undefined' || typeof this.participant == 'undefined' || this.touched == false) {
      this.dialog.open(DialogComponent, { data: { heading: "Select all the fields" } });
    }
    else {
      this.exportTable = true;
      if (this.participant == "All Participants") {
        this.userService.getAllParticipants(this.surveyName).subscribe(
          data => {
            this.participantData = (JSON.parse(data["data"]));
          });
      }
      else {
        this.userService.participantWiseResult(this.surveyName, this.participant).subscribe(
          data => {
            this.participantData = (JSON.parse(data["data"]));
          }
        );
      }
    }
  }

  selectSurveyName(value) {
    this.surveyName = value;
    this.touched = false;
    this.userService.getParticipant(value).subscribe(
      data => {
        this.participants = (JSON.parse(data["data"]));
        if (this.participants.length > 1) this.participants.push({ userID: "All Participants" });
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
      });
  }

  selectParticipant(value) {
    this.touched = true;
    this.participant = value;
  }
  ExportToExcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.table.nativeElement);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, 'SP_Participant_Result.xlsx');

  }

}
