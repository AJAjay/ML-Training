import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/user.service';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { DialogComponent } from 'src/app/administrator/dialog/dialog.component';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  signUpForm: FormGroup;
  signUpResult: any;
  validateError = "";

  constructor(private route: Router, private userService: UserService, private formBuilder: FormBuilder, public dialog: MatDialog) { }

  ngOnInit() {
    this.signUpForm = this.formBuilder.group({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
      // userName: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      // supervisor_email: new FormControl('', [Validators.required])
    });
  }

  backToLogin() {
    this.route.navigate(['login']);
  }

  get firstName() { return this.signUpForm.get("firstName"); }
  get lastName() { return this.signUpForm.get("lastName"); }
  get email() { return this.signUpForm.get("email"); }
  get userName() { return this.signUpForm.get("userName"); }
  get password() { return this.signUpForm.get("password"); }
  get supervisor_email() { return this.signUpForm.get('supervisor_email'); }

  onSubmit(value: any) {
    this.userService.signUp(this.signUpForm.value).subscribe(
      data => {
        this.signUpResult = data;
        if (this.signUpResult.result == "Pass") {
          // this.validateError = this.signUpResult.message;
          this.dialog.open(DialogComponent, { data: { heading: this.signUpResult.message, page: "signUp" } });
        }
        else {
          this.validateError = this.signUpResult.message;
        }
      },
      error => {
        this.validateError = "Internal server problem";
      }
    )
  }

}
