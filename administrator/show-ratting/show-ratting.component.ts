import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-show-ratting',
  templateUrl: './show-ratting.component.html',
  styleUrls: ['./show-ratting.component.css']
})
export class ShowRattingComponent implements OnInit {

  value : string[] = ["Poor", "Need Improvement", "Satisfactory", "Good", "VeryGood"]

  constructor(public config_rate : NgbRatingConfig,public dialogRef: MatDialogRef<ShowRattingComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    config_rate.max = 5
    config_rate.readonly = true;
    console.log(data)
   }

  ngOnInit() {
    
  }

  close(){
    this.dialogRef.close();
  }
}
