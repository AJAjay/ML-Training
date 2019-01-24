import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { UserService } from 'src/app/user.service';
import { DataServiceService } from 'src/app/administrator/data-service.service';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {
  pass : boolean =true;
  result : string;
  constructor(private route: Router,private dataService: DataServiceService, public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private userService: UserService) { 
    }
    
    
  ngOnInit() {
    this.pass = true;
  }
  close() {
    this.dialogRef.close();
    if (this.data.page == "signUp") {
      this.route.navigate(['login']);
    }
  }
  sendEmail(email) {
    
    let details = {
      email: email,
      link: this.data.link,
      surveyName:this.data.name
    };
    
    this.userService.email(details).subscribe(
      data => {
        console.log(data);
        this.pass = false;
        this.result = data['status']
      })            
  }

 copyText() {
    var copyText = <HTMLInputElement>(document.getElementById("inputLink"));
    copyText.select();
    document.execCommand("copy");
  }

  // // Delete a Survey
  // deleteSurvey() {
  //   console.log(this.data.surveyID);
  //   this.userService.deleteSurvey(this.data.surveyID).subscribe(
  //     data => {
  //       this.dialogRef.close();
  //       this.dataService.refreshData(true);
  //     }
  //   )
  // }
  
}
