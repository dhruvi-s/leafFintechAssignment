import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateTaxpreparerComponent } from './add-update-taxpreparer.component';

describe('AddUpdateTaxpreparerComponent', () => {
  let component: AddUpdateTaxpreparerComponent;
  let fixture: ComponentFixture<AddUpdateTaxpreparerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddUpdateTaxpreparerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUpdateTaxpreparerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
