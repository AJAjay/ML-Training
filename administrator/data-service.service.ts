import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
@Injectable({
  providedIn: 'root'
})
export class DataServiceService {
    example:any;
    private messageSource1 = new BehaviorSubject<string>("defalut Message1");
    private messageSource2= new BehaviorSubject<string>("defalut Message2");
    private messageSource3= new BehaviorSubject<boolean>(false);
    private topicsList = new BehaviorSubject<any>(this.example);
    private generalData = new BehaviorSubject<any>(this.example);
    private deleteData = new BehaviorSubject<any>(false);
    // private generalData2 = new BehaviorSubject<any>(this.example);
    currentMessage1 = this.messageSource1.asObservable();
    currentMessage2 = this.messageSource2.asObservable();
    currentMessage3 = this.messageSource3.asObservable();
    topicListMessage = this.topicsList.asObservable();
    generalDataMsg = this.generalData.asObservable(); 
    deleteDataMsg = this.generalData.asObservable(); 
    // generalDataMsg2 = this.generalData2.asObservable(); 

  constructor() {}
  changeMessage1(message:string){
    console.log("........"+message);
    this.messageSource1.next(message);
  }
  changeMessage2(message:string){
    console.log("........"+message);
    this.messageSource2.next(message);
  }
  changeMessage3(message:boolean){
    console.log("........"+message);
    this.messageSource3.next(message);
  }
  addTopicList(topics:any){
    this.topicsList.next(topics)
  }
  addData(data){
    this.generalData.next(data);
  }
  refreshData(message){
    this.generalData.next(message);
  }
  // addData2(data){
  //   this.generalData2.next(data);
  // }
}
