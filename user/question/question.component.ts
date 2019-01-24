import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../user.service';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder } from '@angular/forms';
import { forEach } from '@angular/router/src/utils/collection';
import { DataServiceService } from 'src/app/administrator/data-service.service';
import { Session } from 'selenium-webdriver';
import { MatDialog } from '@angular/material';
import { PopupComponent } from '../popup/popup.component';



@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css']
})
export class QuestionComponent implements OnInit {
  data2: any;
  today: any
  question_count: number;
  topics: any[];
  questions: any;
  resultdata: any;
  surveyForm: FormGroup;
  event_count: number;
  ques_count: number;
  touched_check: Map<string, boolean>;
  slider_value: Map<string, string>;
  index: number;
  prev: number;
  next: number;
  loader: boolean;
  text: string;
  textValue: number;
  textVal: string[];
  checkedValue: any[];
  isChecked = false;
  comments: string;
  surveyName: string;
  adminID: string;
  userID: any;
  options: any;
  name: any;
  result: any;
  surveyID;
  position: number;
  data: any;


  constructor(private route: Router, private userService: UserService, private formBuilder: FormBuilder, public dataService: DataServiceService, public dialog: MatDialog) { }


  ngOnInit() {

    this.dataService.generalDataMsg.subscribe(message => this.data = message);

    this.event_count = 0;
    this.ques_count = 0;
    this.loader = true;
    this.prev = 0;
    this.touched_check = new Map<string, boolean>();
    this.slider_value = new Map<string, string>();
    this.next = 2;
    this.checkedValue = [];
    this.comments;
    this.textVal = ["Poor", "Need Improvement", "Satisfactory", "Good", "VeryGood"];
    this.surveyForm = this.formBuilder.group({
      'textArea': new FormControl('', [Validators.required]),
    });
    this.userID = this.data.email;
    console.log(this.userID);
    // this.userID = 'aravind.r@prodapt.com';
    this.surveyID = this.data.surveyID;
    // this.surveyID = "5c2a0762c93f45226c1d074d	";

    console.log(this.userID);
    console.log(this.surveyID);

    this.userService.getQuestions(this.surveyID).subscribe(
      data => {
        this.resultdata = JSON.parse(data["data"])[0];
        console.log(this.resultdata);
        this.surveyName = this.resultdata.surveyName;
        this.adminID = this.resultdata.userID;
        this.topics = this.resultdata.topics;
        this.totalQuestionsLength();
        this.loader = false;
        this.initialize();

      });
  }

  //previous Question
  prevQuestion() {
    this.next--;
    var currentQuestion = document.getElementById('page' + this.prev);
    currentQuestion.style.display = "block";
    var nextQuestion = document.getElementById('page' + this.next);
    nextQuestion.style.display = "none";
    this.prev--;
  }

  //Next Question
  nextQuestion() {
    this.prev++;
    var currentQuestion = document.getElementById('page' + this.next);
    currentQuestion.style.display = "block";
    var previousQuestion = document.getElementById('page' + this.prev);
    previousQuestion.style.display = "none";
    this.next++;

  }
  moveFirst() {
    var currentQuestion = document.getElementById('page' + 1);
    currentQuestion.style.display = "block";
    var previousQuestion = document.getElementById('page' + (this.next - 1));
    previousQuestion.style.display = "none";
    this.next = 2;
    this.prev = 0;
  }
  moveLast() {
    var currentQuestion = document.getElementById('page' + this.topics.length);
    currentQuestion.style.display = "block";
    var previousQuestion = document.getElementById('page' + (this.prev + 1));
    previousQuestion.style.display = "none";
    this.next = this.topics.length + 1;
    this.prev = this.topics.length - 1;
  }
  //submit survey
  onSubmit() {

    console.log(this.data.general)
    let surveyResult = {
      "surveyID": this.surveyID,
      "userID": this.userID,
      "adminID": this.adminID,
      "surveyName": this.surveyName,
      "general": (typeof this.data.general == 'undefined') ? null : this.data.general.general,
      "topics": this.result,
    }
    this.updateData(surveyResult)
  }
  todayDate() {
    this.today = new Date();
    var dd = this.today.getDate();
    var mm = this.today.getMonth() + 1;
    var yyyy = this.today.getFullYear();
    if (dd < 10) {
      dd = '0' + dd;
    }


  }

  //slider value
  // Update the current slider value (each time you drag the slider handle)
  slideValue(question, j, event) {
    let t_index = this.prev + "_" + j;
    this.slider_value.set(t_index, this.textVal[event.target.value - 1]);
    this.addAnswer(question, this.textVal[event.target.value - 1], j);
  }



  onKey(event: any) { // without type info
    this.comments = event.target.value;
  }

  addAdditionalComment(question, option, j) {
    if (this.result[this.prev].questions == null) this.result[this.prev].questions = []
    let questions: any = {};

  }

  //add answer to map
  addAnswer(question, option, j) {
    // let questions: any;
    // console.log(this.result[this.prev].questions[j])
    if (this.result[this.prev].questions == null) this.result[this.prev].questions = []
    if(this.result[this.prev].questions[j] == null) {
      console.log(this.result[this.prev].questions[j])
      this.result[this.prev].questions[j] = {}
    }
    // console.log(option);
    // questions = {};
    console.log(typeof this.result[this.prev].questions[j])
   
    console.log(question)
    if (question == null) {
      this.result[this.prev].questions[j].comment = (document.getElementById("AdditionalComment" + this.prev + "" + j) as HTMLInputElement).value;
    } else {
      this.result[this.prev].questions[j].question = question.question;
      if (question.questionType != "textField") {
        console.log(option)
        this.result[this.prev].questions[j].options = {};
        this.result[this.prev].questions[j].question_type = 'radioButton';
        this.result[this.prev].questions[j].options[option] = 1;
       
        // this.result[this.prev].questions[j] = questions;
      } else {
        this.result[this.prev].questions[j].question_type = "textField"
        this.result[this.prev].questions[j].options = (document.getElementById("text" + this.prev + "" + j) as HTMLInputElement).value;

        // this.result[this.prev].questions[j] = questions
      }
      this.checkEvent(question, j);
    }
    
  }


  initialize() {
    this.result = []
    for (let i = 0; i < this.topics.length; i++) {
      this.result[i] = {};
      this.result[i].topic = this.topics[i].topic;
      this.result[i].sliderAverage = 0;
    }
  }
  check_Box(event, question, option, j) {

    //initialize array to empty to get rid of execption
    if (this.result[this.prev].questions == null) this.result[this.prev].questions = [];

    // initialize the object
    if (this.result[this.prev].questions[j] == null) this.result[this.prev].questions[j] = {}

    //setting the type of the question
    this.result[this.prev].questions[j].question_type = 'checkBox';
    this.result[this.prev].questions[j].question = question.question;

    if (this.result[this.prev].questions[j].options == null) this.result[this.prev].questions[j].options = {}

    if (event.target.checked) {
      this.result[this.prev].questions[j].options[option] = 1
    } else {
      delete this.result[this.prev].questions[j].options[option]
    }
    this.checkEvent(question, j)
  }
  //existing result is obtained
  updateData(surveyResult): boolean {
    let result: any;
    this.userService.existingResult(this.adminID, this.surveyName).subscribe(
      data => {
        result = JSON.parse(data['data'])[0]
        this.changeValue(result, surveyResult);

      }
    )
    return true;
  }
  //value is calculated and updated in the statics collection
  changeValue(db_result, surveyResult) {
    let sliderLength = 0, sum ,temp=0,lables;
    db_result.attended += 1 
    let total_value=0,slider_sum=0,sliderque_len=0,topic_value;
    for (let i = 0; i < db_result.topics.length; i++) {
      sliderLength = 0;
      sum = 0
      topic_value = 0
      for (let j = 0; j < db_result.topics[i].questions.length; j++) {
        if (db_result.topics[i].questions[j].question_type != "textField") {
          lables = Object.keys(surveyResult.topics[i].questions[j].options)
          if (db_result.topics[i].questions[j].question_type == "slider") {
            sliderque_len += 1
            sliderLength++
            for (let k = 0; k < lables.length; k++) {
              db_result.topics[i].questions[j].options[lables[k]] += surveyResult.topics[i].questions[j].options[lables[k]]
              sum += (this.textVal.indexOf(lables[k]) + 1)
            }


            lables = Object.keys(db_result.topics[i].questions[j].options)
            for (let k = 0; k < lables.length; k++) {
              temp = (this.textVal.indexOf(lables[k]) + 1) * db_result.topics[i].questions[j].options[lables[k]]
              total_value += temp;
              topic_value += temp;
            }
          }
          else {
            for (let k = 0; k < lables.length; k++) {
              db_result.topics[i].questions[j].options[lables[k]] += surveyResult.topics[i].questions[j].options[lables[k]]
            }
          }
        } else {
          db_result.topics[i].questions[j].options.push(surveyResult.topics[i].questions[j].options);

        }
      }
       slider_sum += sum;
       surveyResult.topics[i].sliderAverage = Math.round(sum / sliderLength);
       db_result.topics[i].sliderAverage = Math.round(topic_value/(db_result.attended*sliderLength))
    }
    surveyResult.overallAverage = Math.round(slider_sum / sliderque_len)
    db_result.average = Math.round(total_value / (db_result.attended * sliderque_len))
    console.log(db_result);
    this.userService.updateStatics(this.adminID, this.surveyName, db_result.topics, db_result.average, db_result.attended).subscribe(
      data => {
        this.storeResult(surveyResult);
      }
    )
  }

  storeResult(surveyResult) {
    console.log(surveyResult);
    this.userService.storeResult(surveyResult).subscribe(
      data => {

        if (data["status"] == "Success") {
          let data = {
            email: null,
            surveyID: this.surveyID
          }
          this.dataService.addData(data);
          this.route.navigate(['result']);
        }
      })

  }




  //to get question length
  totalQuestionsLength() {
    for (let topic of this.topics) {
      this.ques_count += topic.questions.length
    }
  }
  // to disable the done button
  checkEvent(questions, j) {
    let t_index = this.prev + "_" + j;
    //to check textfield in not empty
    if (questions.questionType == 'textField') {
      this.checkTextField(j);
    } else if (questions.questionType == 'checkBox') { // to check checkBox is not empty
      this.optionSelected(j);
    } else {
      if (!this.touched_check.has(t_index)) { // to check for radioButton and slider
        this.touched_check.set(t_index, true)
      }
    }
  }
  optionSelected(index) {
    let t_index = this.prev + "_" + index
    if (!this.touched_check.has(t_index)) {
      this.touched_check.set(t_index, true)
    }
    if (Object.keys(this.result[this.prev].questions[index].options).length < 1)
      this.touched_check.delete(t_index)

  }

  checkTextField(index) {
    let t_index = this.prev + "_" + index;
    let text = (document.getElementById("text" + this.prev + "" + index) as HTMLInputElement).value
    if (!this.touched_check.has(t_index) && text.length > 0) {
      this.touched_check.set(t_index, true)
    }
    if (text.length < 1) {
      this.touched_check.delete(t_index)
    }
  }
  getIndex(index): number {
    let count = 0;
    if (this.prev == 0) return index;
    for (let i = 0; i < this.prev; i++) {
      count += this.result[this.prev].questions.length
    }
    return count;
  }
  // to prevent user from submitting empty data
  disableCheck() {
    if (this.ques_count != this.touched_check.size) {
      this.dialog.open(PopupComponent, { data: { general: false } })
    } else {
      this.onSubmit()
    }
  }
}
