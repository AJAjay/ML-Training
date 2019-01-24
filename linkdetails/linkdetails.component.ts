import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, Validators, FormBuilder, FormArray } from '@angular/forms';
import { UserService } from 'src/app/user.service';
import { DialogComponent } from 'src/app/administrator/dialog/dialog.component';
import { DataServiceService } from 'src/app/administrator/data-service.service';
import { PopupComponent } from '../user/popup/popup.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-linkdetails',
  templateUrl: './linkdetails.component.html',
  styleUrls: ['./linkdetails.component.css']
})
export class LinkdetailsComponent implements OnInit {
  obj: { email: any; surveyID: any; surveyType: any; };
  surveyType: any;
  general: any;
  surveyID: any;
  linkdetailsform: FormGroup;
  result: any;
  validateError: "";
  name: any;
  adminID: string;
  surveyName: string;
  constructor(private route: Router, private dataService: DataServiceService, private userService: UserService, private formBuilder: FormBuilder, private activatedRoute: ActivatedRoute, public dialog: MatDialog) { }

  ngOnInit() {
    //create New Form
    this.linkdetailsform = new FormGroup({
      email: new FormControl('', [Validators.required]),
    });

    //Get Survey ID from the link as Parameter
    this.activatedRoute.params.subscribe(params => {
      this.surveyID = params.surveyID;
    });
  }

  //Getter for the email in the form
  get email() { return this.linkdetailsform.get("email"); }

  // submit the details
  onSubmit() {
    this.employeeCheck();
  }

  //Check if the User has already taken the survey 
  userCheck() {
    this.userService.getQuestions(this.surveyID).subscribe(
      data => {
        this.surveyType = JSON.parse(data['data'])[0].surveyType;
        console.log(this.surveyType);
        this.obj = {
          email: this.email.value,
          surveyID: this.surveyID,
          surveyType: this.surveyType
        }
        console.log(this.obj);
        this.userService.linkdetails(this.obj).subscribe(
          data => {
            this.result = data;
            if (this.result.result == "Pass") {
              this.passData();
            }
            else {
              this.dialog.open(DialogComponent, { data: { heading: this.result.message } });
            }
          }
        )
      });


  }

  //Check if the entered email is a valid prodapt Email
  employeeCheck() {
    let value: boolean;
    this.userService.validateLdap(this.email.value).subscribe(
      data => {
        if (data['status'] == "200") {
          this.userCheck()
        } else {
          this.dialog.open(DialogComponent, { data: { heading: "Provide valid Prodapt email ID", email: false } });
        }
      }
    )
  }

  passData() {
    console.log(this.email.value, this.surveyID);
    let data = {
      email: this.email.value,
      surveyID: this.surveyID
    }
    this.dataService.addData(data);

    this.userService.getQuestions(this.surveyID).subscribe(
      data => {
        this.general = JSON.parse(data["data"])[0].general;
        if (this.general.length != 0) {
          this.dialog.open(PopupComponent, { data: { general: true } });
        }
        else {
          this.route.navigate(['question']);
        }
      });
  }

}

