import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BsesReportComponent } from './bses-report.component';

describe('BsesReportComponent', () => {
  let component: BsesReportComponent;
  let fixture: ComponentFixture<BsesReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BsesReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BsesReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
