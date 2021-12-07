import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxScreeningMessageComponent } from './tax-screening-message.component';

describe('TaxScreeningMessageComponent', () => {
  let component: TaxScreeningMessageComponent;
  let fixture: ComponentFixture<TaxScreeningMessageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaxScreeningMessageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaxScreeningMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
