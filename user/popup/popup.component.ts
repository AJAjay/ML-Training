import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { QuestionComponent } from "../question/question.component";
import { UserService } from 'src/app/user.service';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { DataServiceService } from 'src/app/administrator/data-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.css']
})
export class PopupComponent implements OnInit {
  email: any;
  generalReady: boolean = false;
  dataValue: any;
  myForm: FormGroup;
  general: any;
  surveyID: any;

  constructor(private route: Router, @Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<QuestionComponent>, private userService: UserService, private fb: FormBuilder, public dataService: DataServiceService) { }

  ngOnInit() {
    this.dataService.generalDataMsg.subscribe(message => this.dataValue = message);
    // this.surveyID = "5c18e08bc93f451230cfee17";
    this.surveyID = this.dataValue.surveyID;
    this.email = this.dataValue.email;
    console.log(this.surveyID);

    this.userService.getQuestions(this.surveyID).subscribe(
      data => {
        this.general = JSON.parse(data["data"])[0].general;
        console.log(this.general);
        this.createForm(this.general);
        this.generalReady = true;
      });

  }

  // Create form for General Questions
  createForm(general) {
    this.myForm = this.fb.group({
      general: this.fb.array([])
    });
    this.createQuestion();
  }

  // Create General Questions Array
  createQuestion() {
    let control = <FormArray>this.myForm.get('general');
    this.general.forEach(x => {
      control.push(this.fb.group({
        question: [x.question, [Validators.required]],
        answer: ['', [Validators.required]]
      }))
    })
  }


  //On form Submission
  onSubmit(value) {
    console.log(value);
    let data = {
      email: this.email,
      general: value,
      surveyID: this.surveyID
    }
    this.dataService.addData(data);
    this.route.navigate(['question']);
  }


  // Closes the PopUp Box
  close() {
    this.dialogRef.close()
  }



}
