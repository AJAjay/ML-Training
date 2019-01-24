import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../user.service';
import { MatDialog } from '@angular/material';
import { DialogComponent } from 'src/app/administrator/dialog/dialog.component';

@Component({
  selector: 'app-loginpage',
  templateUrl: './loginpage.component.html',
  styleUrls: ['./loginpage.component.css']
})
export class LoginpageComponent implements OnInit {
  loginForm: FormGroup;
  validateError = '';
  login : string;
  login_holder : string;

  constructor(private route: Router, private userService: UserService, public dialog: MatDialog) { }

  ngOnInit() {
    this.login = "Login as Admin";
    this.login_holder = "UserId";
    this.loginForm = new FormGroup({
      'email': new FormControl('', [Validators.required]),
      'password': new FormControl('', [Validators.required])
    });
  }

  get email() { return this.loginForm.get("email"); }

  get password() { return this.loginForm.get("password"); }

  onSubmit() {
    this.userService.name = this.email.value;
    if(this.login != "Login as Admin"){
    this.userService.doLogin(this.email.value, this.password.value).subscribe(
      data => {

        if (data['result'] == 'Pass') {
          this.getAdminDetails(this.email.value)
        } else {
          this.dialog.open(DialogComponent, { data: { heading: "Please provide correct credentials" } });
        }
      }
    )
    }else{
    this.userService.doldap(this.email.value, this.password.value).subscribe(
      data => {
        if (data['status'] == 200) {
          this.route.navigate(['viewResultList']);
          this.getUserDetails(this.email.value)
          console.log(data);
        } else {
          this.dialog.open(DialogComponent, { data: { heading: "Please provide correct credentials" } });
        }
      }
    )
  }
  }
  showPassword() {
    var x = document.getElementById("password") as HTMLInputElement;
    if (x.type === "password") {
      x.type = "text";
    } else {
      x.type = "password";
    }
  }
  adminLogin() {
    if(this.login == "Login as Admin"){
      this.login = "Login as User"
      this.login_holder = "Admin Email"
    }
    else  this.login = "Login as Admin"
  }

  goToSignUp() {
    this.route.navigate(['signup'])
  }

  getAdminDetails(email: string) {
    this.userService.getUser(email).subscribe(
      data => {
        console.log(data);
        let user_details = JSON.parse(data["data"])
        //let is_supervisor = JSON.parse(data["isSupervisor"])
        // sessionStorage.setItem('_id', user_details[0]._id['$oid'])
        // sessionStorage.setItem('last_name', user_details[0].lastName)
        sessionStorage.setItem('email', email)
        sessionStorage.setItem('user_name', email.split('@')[0])
        sessionStorage.setItem('first_name', user_details[0].firstName)
        sessionStorage.setItem('is_supervisor', "true")
        // sessionStorage.setItem('is_supervisor', is_supervisor)
        this.route.navigate(['viewResultList']);
      }
    )
  }
  getUserDetails(email){
    sessionStorage.setItem('email', email)
    sessionStorage.setItem('user_name', email)
    sessionStorage.setItem('first_name', email.split('.')[0])
    sessionStorage.setItem('is_supervisor', "false")
  }
  getName(email):any{
    return email.split('@')[0].split['.'];
  }
}