import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSurveyListComponent } from './view-survey-list.component';

describe('ViewSurveyListComponent', () => {
  let component: ViewSurveyListComponent;
  let fixture: ComponentFixture<ViewSurveyListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewSurveyListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewSurveyListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
