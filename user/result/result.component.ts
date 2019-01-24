import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css']
})
export class ResultComponent implements OnInit {
  userID: string;

  constructor() { }

  ngOnInit() {
    this.userID = sessionStorage.getItem("userID");
  }

}
