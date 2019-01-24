import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { DataServiceService } from 'src/app/administrator/data-service.service';
import { UserService } from '../../user.service';
import { MatDialog } from '@angular/material';
import { DialogComponent } from 'src/app/administrator/dialog/dialog.component';
import {  Manipulate } from '../collection';

@Component({
  selector: 'app-view-survey',
  templateUrl: './view-survey.component.html',
  styleUrls: ['./view-survey.component.css']
})
export class ViewSurveyComponent {
  surveyID: any;

  //Question Types 
  questionType = [
    { value: 'checkBox', viewValue: 'Check box' },
    { value: 'radioButton', viewValue: 'Radio button' },
    { value: 'textField', viewValue: 'Text field' },
    { value: 'slider', viewValue: 'Slider' }
  ];

  GeneralQuestionType = [
    { value: 'textBox', viewValue: 'Text Box' },
    { value: 'datePicker', viewValue: 'Date Picker' }
  ];


  supervisor: boolean;
  view: boolean;
  surveyName: string;
  myForm: FormGroup;
  data_template: any;
  email: any;
  loaded: boolean;
  userID: string;
  udis = false;
  rdis = false;
  surveyEmail: any;
  surveyReady = false;
  manipulate: Manipulate;


 //Accordion
 accordion(num) {
  var content = document.getElementById('accordion' + num);
  var plus = document.getElementById('plus' + num);
  var minus = document.getElementById('minus' + num);
  if (content.style.maxHeight != "0px") {
    content.style.maxHeight = "0px";
    plus.style.display = "inline";
    minus.style.display = "none";
  }
  else {
    content.style.maxHeight = content.scrollHeight + "px";
    plus.style.display = "none";
    minus.style.display = "inline";
  }
}

//for general topic
accordionGeneral() {
  var content = document.getElementById('accordion');
  var plus = document.getElementById('plus_g');
  var minus = document.getElementById('minus_g');
  if (content.style.maxHeight != "0px") {
    content.style.maxHeight = "0px";
    plus.style.display = "inline";
    minus.style.display = "none";
  }
  else {
    content.style.maxHeight = content.scrollHeight + "px";
    plus.style.display = "none";
    minus.style.display = "inline";
  }
}

//change accordion height on adding new questions and topics
accordionHeight(num) {
  var content = document.getElementById('accordion' + num);
  content.style.maxHeight = "100%";
}
accordionExpandTopic(control, newTopic) {
  var content = document.getElementById('accordion');
  var plus = document.getElementById('plus_g');
  var minus = document.getElementById('minus_g');
  content.style.maxHeight = "0px";
  plus.style.display = "inline";
  minus.style.display = "none";
  for (let i = 1; i < control.length; i++) {
    var content = document.getElementById('accordion' + i);
    var plus = document.getElementById('plus' + i);
    var minus = document.getElementById('minus' + i);
    content.style.maxHeight = "0px";
    plus.style.display = "inline";
    minus.style.display = "none";
  }
  // content.style.maxHeight = "100%";
}

  constructor(private fb: FormBuilder, private route: Router, private userService: UserService, private dataService: DataServiceService, public dialog: MatDialog) {

    this.dataService.currentMessage1.subscribe(message => this.surveyName = message);
    this.dataService.currentMessage2.subscribe(message => this.userID = message);
    this.dataService.currentMessage3.subscribe(message => this.view = message);
    this.loaded = false;

    this.email = sessionStorage.getItem("email");
    this.supervisor = sessionStorage.getItem("is_supervisor") == "true";
    this.manipulate = new Manipulate(userService);
    console.log(this.userID);
    console.log(this.surveyName);
    this.userService.fetchTemplate(this.userID, this.surveyName).subscribe(
      data => {

        this.data_template = (JSON.parse(data["data"]))[0];
        console.log(this.data_template);
        this.createForm(this.data_template);
        this.surveyID = this.data_template._id.$oid;
        this.surveyReady = true;
      }
    );
  }

  //create Form
  createForm(data) {

    this.myForm = this.fb.group({
      surveyName: new FormControl(data.surveyName, [Validators.required]),
      topics: this.fb.array([]),
      general: this.fb.array([]) // for general topics
    })
    this.surveyEmail = data.userID;
    this.loaded = true;
    this.setTopics();
    this.setGeneralQuestions()
  }
  //for general topics
  setGeneralQuestions() {
    let control = <FormArray>this.myForm.get('general');
    this.data_template.general.forEach(x => {
      control.push(this.fb.group({
        question: x.question,
        questionType:x.questionType
      }))
    })

  }
  //to add general question
  addGeneralQestion() {
    let control = <FormArray>this.myForm.get('general');
    control.push(this.fb.group({
      question: ['', [Validators.required]],
      questionType: ['', [Validators.required]]
    }))
    var content = document.getElementById('accordion');
    content.style.maxHeight = "100%";
  }
  //to delete general question
  deleteGeneralQue(index) {
    let control = <FormArray>this.myForm.get('general');
    control.removeAt(index);
  }


  //Adds NewTopic
  addNewTopic() {
    let control = <FormArray>this.myForm.get('topics');
    control.push(
      this.fb.group({
        topic: [''],
        questions: this.fb.array([])
      })
    )
    console.log(control);
    let newTopic = control.length;
    console.log("New" + newTopic);
    this.accordionExpandTopic(control, newTopic);
  }

  //Adds NewQuestion
  addNewQuestion(control, num) {
    control.push(
      this.fb.group({
        question: [''],
        questionType: [''],
        options: this.fb.array([])
      }))
    this.accordionHeight(num);
  }

  //Adds NewOption
  addNewOption(control, num) {
    control.push(
      this.fb.group({
        option: ['']
      }))
    this.accordionHeight(num);
  }

  //Delete a Topic
  deleteTopic(index) {
    let control = <FormArray>this.myForm.get('topics');
    control.removeAt(index)
  }

  //Delete a Question
  deleteQuestion(control, index) {
    control.removeAt(index);
  }

  //Delete a Option
  deleteOption(control, index) {
    control.removeAt(index);
  }

  //Set Topic Initially
  setTopics() {
    let control = <FormArray>this.myForm.get('topics');
    this.data_template.topics.forEach(x => {
      control.push(this.fb.group({
        topic: x.topic,
        questions: this.setQuestions(x)
      }))
    })
  }

  //Set Question Initially
  setQuestions(x) {
    let arr = new FormArray([])
    x.questions.forEach(y => {
      arr.push(this.fb.group({
        question: y.question,
        questionType: y.questionType,
        options: this.setOptions(y)
      }))
    })
    return arr;
  }

  //Set Option Initially
  setOptions(y) {
    let arr = new FormArray([])
    y.options.forEach(z => {
      arr.push(this.fb.group({
        option: z.option
      }))
    })
    return arr;
  }

  //Submits the Form Values to the Database
  onSubmit(value) {
    value.status = "Submitted";
    this.userService.updateTemplate(this.userID, value).subscribe(
      data => {
        this.udis = true;
        console.log(value)
        this.dialog.open(DialogComponent, { data: { heading: "Survey has been Updated" } });
      })
  }

  //status of the survey  is update to reviewed
  reviewed() {
    this.rdis = true;
    let link = "192.168.51.25:8081/" + this.surveyID;
    this.userService.reviewSurvey(this.userID, this.myForm.value, link).subscribe(
      data => {
      });
    this.manipulate.manipulateData(this.myForm.value.topics, this.data_template,this.surveyID);
    this.dialog.open(DialogComponent, { data: { heading: "Survery has been reviewed. Use this link to take survey ", link: link, name: this.myForm.get('surveyName').value, email: true } });
  }
}
