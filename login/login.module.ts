import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginpageComponent } from './loginpage/loginpage.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SignupComponent } from './signup/signup.component';
import { ForgotpasswordComponent } from 'src/app/login/forgotpassword/forgotpassword.component';
import {MaterialModule} from '../material';


@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  declarations: [LoginpageComponent, SignupComponent,ForgotpasswordComponent]
})
export class LoginModule { }
