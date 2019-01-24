import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TravelReportComponent } from './travel-report.component';

describe('TravelReportComponent', () => {
  let component: TravelReportComponent;
  let fixture: ComponentFixture<TravelReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TravelReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TravelReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
