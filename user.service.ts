import { Injectable } from '@angular/core';
import  {  HttpClient,  HttpHeaders,  HttpParams  }  from  '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  name: string;
  topic: string;
  host = "http://192.168.51.25:9082/";
  httpOptions: any = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }
  constructor(private http: HttpClient) { }


  doLogin(email: any, password: any) {
    
    return this.http.get(this.host + "survey/" + email + "/" + password, this.httpOptions);
  }

  //LDAP Authentication
  doldap(uid: any, password: any) {
    return this.http.post("http://192.168.51.25:8080/login", {
      "uid": uid,
      "password": password
    }, this.httpOptions);
  }

  //LDAP validation for user
  validateLdap(email: any) {
    return this.http.post("http://192.168.51.25:8080/mailCheck", {
      "mail": email
    }, this.httpOptions);
  }


  //To register new user
  signUp(value: any) {
    return this.http.post(this.host + "signup", value, this.httpOptions);
  }

  linkdetails(value) {
    return this.http.post(this.host + "linkdetails", value, this.httpOptions);
  }


  forgotpassword(email: any) {
    return this.http.get(this.host + "forgotpassword/" + email, this.httpOptions);
  }
  // Validate for duplicate Survey Name
  validateSurveyName(userID, surveyName) {
    return this.http.get(this.host + "validateSurveyName/" + userID + "/" + surveyName, this.httpOptions);
  }
  //Get Questions for user to take survey 
  getQuestions(surveyID) {
    return this.http.get(this.host + "getQuestions/" + surveyID, this.httpOptions);
  }

  email(details) {
    console.log(details);
    // const httpOptions = this.httpOptions;
    // httpOptions.params = new HttpParams().set('details', details);
    // let value = { from: sessionStorage.getItem('email'), to: sessionStorage.getItem('supervisor_email') };
    return this.http.post(this.host + "sendMail", details, this.httpOptions);
  }

  //Store the survey result
  storeResult(surveyResult) {
    return this.http.post(this.host + "storeResults", surveyResult, this.httpOptions);
  }
  //Show the result to the admin
  showResult() {
    return this.http.get(this.host + "showResult", this.httpOptions);
  }
  // to show the result of all the survey
  showStatistics(user, surveyName) {
    return this.http.get(this.host + "showStat/" + user + "/" + surveyName, this.httpOptions);
  }

  getTopics(username: string) {
    return this.http.get(this.host + "getTopics/" + username, this.httpOptions);
  }

  createTopics(username: string, topic: string) {
    return this.http.get(this.host + "createTopics/" + username + "/" + topic, this.httpOptions);
  }
  //Returns the userdetails 
  getUser(email: any) {
    // console.log(email)
    return this.http.get(this.host + "getUser/" + email, this.httpOptions);
  }
  //store the newly created survey
  storeTemplate(value) {
    console.log(value)
    return this.http.post(this.host + "storeTemplate", value, this.httpOptions);
  }
  //Gets the admin surveylist
  getSurveyList(userID) {
    return this.http.get(this.host + "getSurveyList/" + userID, this.httpOptions);
  }
  //Gets the surveylist for the others below their supervision
  getOthersSurveyList(userID) {
    return this.http.get(this.host + "getOthersSurveyList/" + userID, this.httpOptions);
  }
  //Gets the admin survey reviewed list
  getResultSurveyList(userID) {
    return this.http.get(this.host + "getResultSurveyList/" + userID, this.httpOptions);
  }
  //to get the survey reviewed list for the others below your supervision
  getOthersResultSurveyList(userID) {

    return this.http.get(this.host + "getOthersResultSurveyList/" + userID, this.httpOptions);
  }
  fetchTemplate(userID, surveyName) {
    return this.http.get(this.host + "viewSurvey/" + userID + "/" + surveyName, this.httpOptions);
  }
  updateTemplate(userID, value) {
    var obj = {
      userID: userID,
      surveyValue: value
    }
    return this.http.post(this.host + "updateTemplate", obj, this.httpOptions);
  }
  reviewSurvey(userID, value, link) {
    var obj = {
      userID: userID,
      link: link,
      surveyValue: value,
     
    }
    return this.http.post(this.host + "reviewSurvey", obj, this.httpOptions);
  }
  searchViewResult(userId, word) {
    return this.http.get(this.host + "searchViewResult/" + userId + "/" + word, this.httpOptions);
  }

  searchResult(userId, word) {
    return this.http.get(this.host + "searchResult/" + userId + "/" + word, this.httpOptions);
  }

  storeBaseStatics(value: any) {
    return this.http.post(this.host + "storeBaseStatics", value, this.httpOptions);
  }
  existingResult(userId: any, surveyName: any) {
    return this.http.get(this.host + "existingResult/" + userId + "/" + surveyName, this.httpOptions);
  }
  updateStatics(userId: any, surveyName: any, value, average,attended) {
    let obj = {
      userId: userId,
      surveyName: surveyName,
      value: value,
      average: average,
      attended: attended,
    }
    return this.http.post(this.host + "updateStatistics", obj, this.httpOptions);
  }
  getSurveyCount(userId: any, surveyName: any) {
    return this.http.get(this.host + "surveyCount/" + userId + "/" + surveyName, this.httpOptions);
  }
  //Get participant wise result
  participantWiseResult(surveyName, participant) {
    return this.http.get(this.host + "participantWiseResult/" + surveyName + "/" + participant, this.httpOptions);
  }
  //Get all survey name
  getAllSurveyName() {
    return this.http.get(this.host + "getAllSurveyName/", this.httpOptions);
  }
  //Get all participant based on survey name
  getParticipant(value) {
    return this.http.get(this.host + "getParticipant/" + value, this.httpOptions);
  }
  //Get All Participants
  getAllParticipants(surveyName){
    return this.http.get(this.host + "getAllParticipants/" + surveyName, this.httpOptions);
  }
  getGeneralQuestions(object_id){
    return this.http.get(this.host + "generalQuestions/" + object_id, this.httpOptions);
  }
  deleteSurvey(object_id){
    return this.http.get(this.host + "deleteSurvey/" + object_id, this.httpOptions);
  }

  storeDataTemplate(data){
    return this.http.post(this.host + "storeDataTemplate",data,this.httpOptions);
  }
  getDataTemplate(id){
    return this.http.get(this.host + "getDataTemplate/"+id,this.httpOptions);
  }
  dateBased(from_date,to_date,id){
    // let param = new HttpParams().set("from_date",from_date).set("to_date",to_date)
    return this.http.post(this.host + 'dateBased',{from: from_date,to: to_date,id:id},this.httpOptions);
  }
}
