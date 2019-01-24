import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../user.service';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material';
import { DialogComponent } from 'src/app/administrator/dialog/dialog.component';
import { Upload } from 'src/app/administrator/create-questionnaire/excelToJson.js';
import { ViewChild, ElementRef } from '@angular/core';
import * as XLSX from 'xlsx';


@Component({
  selector: 'app-create-questionnaire',
  templateUrl: './create-questionnaire.component.html',
  styleUrls: ['./create-questionnaire.component.css']
})
export class CreateQuestionnaireComponent {
  renderData: any;
  SurveyType: any;
  surveyReady: boolean = false;
  curDate: Date;
  myForm: FormGroup;
  uploaded: boolean = false;
  disableButton = false;
  disableSurveyName: boolean = false;
  SurveyNameValidate;
  genaral_ques: any;
  is_supervisor: boolean;
  importReady: boolean = false;
  private subscription: Subscription;

  @ViewChild('table1') table1: ElementRef;
  @ViewChild('table2') table2: ElementRef;

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

  upload() {

    this.renderData = Upload();
    if (this.renderData == false) {
      this.dialog.open(DialogComponent, { data: { heading: "Please upload a valid Excel file" } });
    }
    else if (this.renderData == "empty") {
      this.dialog.open(DialogComponent, { data: { heading: "This excel file is Empty" } });
    }
    else {
      this.uploaded = true;
      this.dialog.open(DialogComponent, { data: { heading: "File has been Uploaded" } });
    }
  }

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
  }

  //Form Structure
  data = {
    surveyName: '',
    topics: [
      {
        topic: '',
        questions: [
          {
            question: '',
            questionType: '',
            comment: '',
            options: [
              {
                option: '',

              }
            ]
          }
        ]
      }
    ]
  }
  constructor(private fb: FormBuilder, private route: Router, private userService: UserService, public dialog: MatDialog, private activatedRoute: ActivatedRoute) {
    this.is_supervisor = sessionStorage.getItem("is_supervisor") == "true";
    this.activatedRoute.params.subscribe(params => {
      this.SurveyType = params.type;
      if (this.SurveyType == "newSurvey") {
        this.importReady = false;
        this.renderData = this.data;
        this.createForm();
      }
    });
  }

  generateSurvey() {
    this.renderData = Upload();
    if (typeof this.renderData == "undefined" || typeof this.renderData.surveyName == "undefined") {
      this.dialog.open(DialogComponent, { data: { heading: "Please upload valid Excel template" } });
    }
    else {
      this.importReady = true;
      this.createForm();
    }

  }

  createForm() {
    this.myForm = this.fb.group({
      userID: new FormControl(sessionStorage.getItem('email'), [Validators.required]),
      createdBy: new FormControl(sessionStorage.getItem('user_name'), [Validators.required]),
      createDate: new FormControl('No date', [Validators.required]),
      status: new FormControl('InProgress', [Validators.required]),
      link: new FormControl('No link yet', [Validators.required]),
      surveyType: new FormControl('', [Validators.required]),
      surveyName: new FormControl({ value: this.renderData.surveyName.trim(), disabled: false }, [Validators.required]),
      topics: this.fb.array([]),
      general: this.fb.array([])
    });
    this.setTopics();
    this.surveyReady = true;
    if (this.SurveyType == "uploadSurvey") {
      this.validate();
    }
    
  }

  addGeneralQuestion() {
    let control = <FormArray>this.myForm.get('general');
    control.push(this.fb.group({
      question: ['', [Validators.required]],
      questionType: ['', [Validators.required]]
    }))
    var content = document.getElementById('accordion');
    content.style.maxHeight = "100%";
  }

  deleteGeneralQuestion(index) {
    let control = <FormArray>this.myForm.get('general');
    control.removeAt(index);
  }

  //validate survey name
  validate() {
    if (this.myForm.value.surveyName.length > 0) {
      this.userService.validateSurveyName(sessionStorage.getItem('email'), this.myForm.value.surveyName).subscribe(
        data => {
          if (data['result'] == 'Pass') {
            this.SurveyNameValidate = 'pass';
          }
          else {
            this.SurveyNameValidate = 'fail';
          }
        })
    }
  }

  //Adds NewTopic
  addNewTopic() {
    if (!this.myForm.invalid) {
      let control = <FormArray>this.myForm.get('topics');
      control.push(
        this.fb.group({
          topic: [''],
          questions: this.fb.array([])
        })
      )
      let newTopic = control.length;
      this.accordionExpandTopic(control, newTopic);
    }
    else {
      this.dialog.open(DialogComponent, { data: { heading: "Please fill all fields and continue" } });
    }
  }

  //Adds NewQuestion
  addNewQuestion(control, num) {
    if (!this.myForm.invalid) {
      control.push(
        this.fb.group({
          question: [''],
          questionType: [''],
          comment: [''],
          options: this.fb.array([])
        }))
      this.accordionHeight(num);
    }
    else {
      this.dialog.open(DialogComponent, { data: { heading: "Please fill all fields and continue" } });
    }
  }

  //Adds NewOption
  addNewOption(control, num) {
    if (!this.myForm.invalid) {
      control.push(
        this.fb.group({
          option: ['']
        }))
      this.accordionHeight(num);
    }
    else {
      this.dialog.open(DialogComponent, { data: { heading: "Please fill all fields and continue" } });
    }
  }
  addDefaultOption(control, num) {
    control.push(
      this.fb.group({
        option: ['']
      }))
  }

  //Delete a Topic
  deleteTopic(index) {
    let control = <FormArray>this.myForm.get('topics');
    let len = control.controls.length;
    if (len == 1) this.dialog.open(DialogComponent, { data: { heading: "Must have atleast One Topic" } });
    else control.removeAt(index)
  }

  //Delete a Question
  deleteQuestion(control, index) {
    let len = control.controls.length;
    if (len == 1) this.dialog.open(DialogComponent, { data: { heading: "Must have atleast One Question" } });
    else control.removeAt(index);
  }

  //Delete a Option
  deleteOption(control, index) {
    let len = control.controls.length;
    if (len == 2) this.dialog.open(DialogComponent, { data: { heading: "Must have atleast two Options" } });
    else control.removeAt(index);
  }

  removeOptions(control, event) {
    if(event.target.value == "textField"){
    }
    if (event.target.value == "slider" || event.target.value == "textField") {
      let len = control.controls.length;
      for (let i = 0; i < len; i++) {
        control.removeAt(0);
      }
    }
    else {
      let len = control.controls.length;
      for (let i = 0; i < len; i++) {
        control.removeAt(0);
      }
      for (let j = 0; j < 2; j++) this.addDefaultOption(control, j);
    }
  }

  //Set Topic Initially
  setTopics() {
    let control = <FormArray>this.myForm.get('topics');
    this.renderData.topics.forEach(x => {
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
        comment: y.comment,
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

  //Save Survey
  saveSurvey() {
    this.disableSurveyName = true;
    this.curDate = new Date();
    this.myForm.value.createDate = this.curDate;
    this.myForm.value.surveyName = this.myForm.value.surveyName.trim();

    this.userService.storeTemplate(this.myForm.value).subscribe(
      data => {
        console.log(this.myForm.value);
        this.dialog.open(DialogComponent, { data: { heading: "Survey has been Saved" } });
      })
  }

  //Submits the Form Values to the Database
  onSubmit(value) {
    this.disableButton = true;
    this.curDate = new Date();
    value.status = "Submitted";
    value.surveyName = value.surveyName.trim();
    value.createDate = this.curDate;
    this.userService.storeTemplate(value).subscribe(
      data => {
        this.dialog.open(DialogComponent, { data: { heading: "Survey submitted for Supervisor review" } });
      })
  }

  ExportToExcel() {
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.table1.nativeElement);
    const ws1: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.table2.nativeElement);
    XLSX.utils.book_append_sheet(wb, ws, 'Template');
    XLSX.utils.book_append_sheet(wb, ws1, 'Sample Survey Sheet');

    /* save to file */
    XLSX.writeFile(wb, 'SP_Template.xlsx');

  }
}
