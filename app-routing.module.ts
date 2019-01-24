import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LoginpageComponent } from 'src/app/login/loginpage/loginpage.component';
import { QuestionComponent } from 'src/app/user/question/question.component';
import { MainComponent } from 'src/app/shared/main/main.component';
import { ResultComponent } from 'src/app/user/result/result.component';
import { CreateQuestionnaireComponent } from './administrator/create-questionnaire/create-questionnaire.component';
import { ChartComponent } from 'src/app/administrator/chart/chart.component';
import { SignupComponent } from 'src/app/login/signup/signup.component';
import { DashBoardComponent } from 'src/app/administrator/dashBoard/dashBoard.component';
import { LoaderComponent } from 'src/app/loader/loader.component';
import { ViewSurveyComponent } from 'src/app/administrator/view-survey/view-survey.component';
import { ForgotpasswordComponent } from './login/forgotpassword/forgotpassword.component';
import { ViewSurveyListComponent } from './administrator/view-survey-list/view-survey-list.component';
import { ViewResultListComponent } from './administrator/view-survey-list/view-result-list.component'
import { LinkdetailsComponent } from './linkdetails/linkdetails.component';
import { ParticipantWiseResultComponent } from 'src/app/administrator/participant-wise-result/participant-wise-result.component';
import { AverageComponent } from './administrator/average/average.component';
import { PopupComponent } from 'src/app/user/popup/popup.component';
import { TravelReportComponent } from './administrator/travel-report/travel-report.component';
import { TravelCommentsReportComponent } from './administrator/travel-comments-report/travel-comments-report.component';


const appRoutes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginpageComponent },
  { path: 'forgotpassword', component: ForgotpasswordComponent },
  { path: 'dashBoard', component: DashBoardComponent },
  { path: 'participantWiseResult', component: ParticipantWiseResultComponent },
  { path: 'question', component: QuestionComponent },
  { path: 'result', component: ResultComponent },
  { path: 'create/:type', component: CreateQuestionnaireComponent },
  { path: 'viewSurvey', component: ViewSurveyComponent },
  { path: 'chart', component: ChartComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'loader', component: LoaderComponent },
  { path: 'viewSurveyList', component: ViewSurveyListComponent },
  { path: 'viewResultList', component: ViewResultListComponent },
  { path: 'general', component:PopupComponent},
  { path: 'average', component: AverageComponent },
  { path: 'travelReport', component:TravelReportComponent},
  { path: 'travelCommentsReport', component:TravelCommentsReportComponent},
  { path: ':surveyID', component:LinkdetailsComponent}
  

];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
