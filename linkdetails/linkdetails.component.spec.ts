import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkdetailsComponent } from './linkdetails.component';

describe('LinkdetailsComponent', () => {
  let component: LinkdetailsComponent;
  let fixture: ComponentFixture<LinkdetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LinkdetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
