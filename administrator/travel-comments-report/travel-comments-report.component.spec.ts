import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TravelCommentsReportComponent } from './travel-comments-report.component';

describe('TravelCommentsReportComponent', () => {
  let component: TravelCommentsReportComponent;
  let fixture: ComponentFixture<TravelCommentsReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TravelCommentsReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TravelCommentsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
