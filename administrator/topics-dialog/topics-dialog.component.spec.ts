import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopicsDialogComponent } from './topics-dialog.component';

describe('TopicsDialogComponent', () => {
  let component: TopicsDialogComponent;
  let fixture: ComponentFixture<TopicsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopicsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopicsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
