import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResultComponent } from './result/result.component';
import { QuestionComponent } from 'src/app/user/question/question.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { PopupComponent } from './popup/popup.component';
import {MaterialModule} from '../material';


import { MatButtonModule, MatDialogModule, MatIconModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    MatRadioModule,
    MaterialModule
  ],
  declarations: [
    QuestionComponent,
    ResultComponent,
    PopupComponent
  ],
   entryComponents:[PopupComponent ]
})
export class UserModule { }
