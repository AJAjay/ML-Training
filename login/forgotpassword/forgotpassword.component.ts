import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../user.service';
import { MatDialog } from '@angular/material';
import { DialogComponent } from 'src/app/administrator/dialog/dialog.component';
@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.css']
})
export class ForgotpasswordComponent implements OnInit {
  forgotpasswordform: FormGroup;
  validateError: string;
  constructor(private route: Router, private userService: UserService, public dialog: MatDialog) {

  }

  ngOnInit() {
    this.forgotpasswordform = new FormGroup({
      'email': new FormControl,
    });
  }
  get email() { return this.forgotpasswordform.get("email"); }
  onSubmit(formValue) {
    this.userService.forgotpassword(formValue.email).subscribe(
      data => {
        if (data['result'] == 'Pass') {
          this.dialog.open(DialogComponent, { data: { heading: "Password has been sent to your email" } });
        }

        else {
          this.dialog.open(DialogComponent, { data: { heading: "Please provide a valid Email" } });
        }
      }
    )

  }
}
