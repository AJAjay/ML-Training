import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/user.service';
import { Router } from '@angular/router';
import { DataServiceService } from 'src/app/administrator/data-service.service';
import { MatDialog } from '@angular/material';
import { TopicsDialogComponent } from '../topics-dialog/topics-dialog.component';

import { DialogComponent } from 'src/app/administrator/dialog/dialog.component';

@Component({
  selector: 'app-view-survey-list',
  templateUrl: './view-survey-list.component.html',
  styleUrls: ['./view-survey-list.component.css']
})
export class ViewResultListComponent implements OnInit {

  name: string;
  userID: string;
  surveyList: any;
  loader: boolean;
  surveyName: string;
  othersSurveyList: any;
  isSupervisor: boolean;
  search_String: string;

  constructor(private route: Router, private userService: UserService, private dataService: DataServiceService, public dialog: MatDialog) {

    this.name = sessionStorage.getItem('first_name');
    this.userID = sessionStorage.getItem('email');
    this.isSupervisor = sessionStorage.getItem('is_supervisor') == 'true' ? true : false;

    this.getData();

  }

  ngOnInit() {
    this.loader = true;
  }

  loadSurvey(index) {
    this.userService.getSurveyCount(this.surveyList[index].userID, this.surveyList[index].surveyName).subscribe(
      data => {
        let attended = data
        this.openResult(index, attended)
      }
    )

  }
  openResult(index, attended): void {
    const dialogRef = this.dialog.open(TopicsDialogComponent, { data: { id: this.surveyList[index]._id['$oid'], topics: this.surveyList[index].topics, user: this.surveyList[index].userID, surveyName: this.surveyList[index].surveyName, lables: ["Attended"], dataset: [attended], info: true } });
  }

  search() {
    if (this.search_String != undefined && this.search_String.length > 1) {
      delete (this.surveyList);
      this.userService.searchViewResult(this.userID, this.search_String).subscribe(
        data => {
          this.surveyList = (JSON.parse(data["data"]));
        }
      )
    } else this.getData()
  }
  getData() {

    this.userService.getResultSurveyList(this.userID).subscribe(
      data => {

        this.surveyList = (JSON.parse(data["data"]));
        this.loader = false
      })

  }
  sendMail(pos) {
    this.dialog.open(DialogComponent, { data: { heading: "Use this link to take survey ", link: this.surveyList[pos].link, name: this.surveyList[pos].surveyName, email: true } })
  }

  // Delete a Survey
  showPopUp(i) {
    let item = document.getElementById('popUp' + (i + 1));
    item.style.display = 'flex';


  }
  deleteRow(i) {
    this.userService.deleteSurvey(this.surveyList[i]._id.$oid).subscribe(
      data => {
        this.getData();
      }
    )
  }
  removePopUp(i) {
    let item = document.getElementById('popUp' + (i + 1));
    item.style.display = 'none';
  }

}
