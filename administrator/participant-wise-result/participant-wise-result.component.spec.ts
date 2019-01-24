import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticipantWiseResultComponent } from './participant-wise-result.component';

describe('ParticipantWiseResultComponent', () => {
  let component: ParticipantWiseResultComponent;
  let fixture: ComponentFixture<ParticipantWiseResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParticipantWiseResultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParticipantWiseResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
