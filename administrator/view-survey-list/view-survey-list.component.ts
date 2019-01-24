import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/user.service';
import { Router } from '@angular/router';
import { DataServiceService } from 'src/app/administrator/data-service.service';
import { DialogComponent } from 'src/app/administrator/dialog/dialog.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-view-survey-list',
  templateUrl: './view-survey-list.component.html',
  styleUrls: ['./view-survey-list.component.css']
})
export class ViewSurveyListComponent implements OnInit {
  curDate: Date;
  user_name: string;
  loader: boolean;
  surveyName: string;
  name: string;
  userID: string;
  surveyList: any;
  othersSurveyList: any;
  isSupervisor: boolean;
  search_String: string;
  constructor(private route: Router, private userService: UserService, private dataService: DataServiceService, public dialog: MatDialog) {
    this.isSupervisor = sessionStorage.getItem('is_supervisor') == 'true' ? true : false;
  }

  ngOnInit() {
    this.loader = true;
    this.name = sessionStorage.getItem('first_name');
    this.userID = sessionStorage.getItem('email');
    this.getData()
  }

  loadSurvey(i, view: boolean) {
    this.dataService.changeMessage1(this.surveyList[i].surveyName);
    this.dataService.changeMessage2(this.surveyList[i].userID);
    this.dataService.changeMessage3(view);
    this.route.navigate(['viewSurvey']);

  }
  loadOthersSurvey(i, view: boolean) {
    this.dataService.changeMessage1(this.othersSurveyList[i].surveyName);
    this.dataService.changeMessage2(this.othersSurveyList[i].userID);
    this.dataService.changeMessage3(view);
    this.route.navigate(['viewSurvey']);
  }
  search() {
    if (this.search_String != undefined && this.search_String.length > 1) {

      delete (this.surveyList)

      this.userService.searchResult(this.userID, this.search_String).subscribe(
        data => {
          this.surveyList = (JSON.parse(data["data"]));
        }
      )
    } else this.getData()
  }
  getData() {

    this.userService.getSurveyList(this.userID).subscribe(
      data => {
        this.surveyList = (JSON.parse(data["data"]));
        this.loader = false;
      })

  }
  sendMail(pos) {
    this.dialog.open(DialogComponent, { data: { heading: "Use this link to take survey ", link: this.surveyList[pos].link, name: this.surveyList[pos].surveyName, email: true } })
  }

  // Delete a Survey
  showPopUp(i) {
    console.log(i);
    let item = document.getElementById('popUp' + (i + 1));
    item.style.display = 'flex';


  }
  deleteRow(i) {
    console.log(this.surveyList[i]._id.$oid);
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

  copyText() {
    var copyText = <HTMLInputElement>(document.getElementById("inputLink"));
    copyText.select();
    document.execCommand("copy");
  }
}
