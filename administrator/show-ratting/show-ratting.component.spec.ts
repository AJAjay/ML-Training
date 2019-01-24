import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowRattingComponent } from './show-ratting.component';

describe('ShowRattingComponent', () => {
  let component: ShowRattingComponent;
  let fixture: ComponentFixture<ShowRattingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowRattingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowRattingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
