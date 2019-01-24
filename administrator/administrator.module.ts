import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DashBoardComponent } from './dashBoard/dashBoard.component';
import { ChartComponent } from './chart/chart.component';
import { SharedModule } from '../shared/shared.module';
import { CreateQuestionnaireComponent } from 'src/app/administrator/create-questionnaire/create-questionnaire.component';
import { QuestionnaireRoutingModule } from 'src/app/administrator/questionnaire-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ViewSurveyComponent } from './view-survey/view-survey.component';
import { ViewSurveyListComponent } from './view-survey-list/view-survey-list.component';
import { DialogComponent } from './dialog/dialog.component';
import { ViewResultListComponent } from './view-survey-list/view-result-list.component';
import { TopicsDialogComponent } from './topics-dialog/topics-dialog.component';
import { ParticipantWiseResultComponent } from './participant-wise-result/participant-wise-result.component';
import { AverageComponent } from './average/average.component';
import { ShowRattingComponent } from './show-ratting/show-ratting.component';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material';
import { TravelReportComponent } from './travel-report/travel-report.component';
import { TravelCommentsReportComponent } from './travel-comments-report/travel-comments-report.component';
import { PaginationComponent } from '../shared/pagination/pagination.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    QuestionnaireRoutingModule,
    BrowserAnimationsModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    MatRadioModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  declarations: [
    DashBoardComponent,
    ChartComponent,
    CreateQuestionnaireComponent,
    ViewSurveyComponent,
    ViewSurveyListComponent,
    DialogComponent,
    ViewResultListComponent,
    TopicsDialogComponent,
    ParticipantWiseResultComponent,
    AverageComponent,
    ShowRattingComponent,
    TravelReportComponent,
    TravelCommentsReportComponent,

  ],
  entryComponents: [DialogComponent, TopicsDialogComponent, ShowRattingComponent
  ]
})
export class AdministratorModule { }
