import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxpreparerComponent } from './taxpreparer.component';

describe('TaxpreparerComponent', () => {
  let component: TaxpreparerComponent;
  let fixture: ComponentFixture<TaxpreparerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaxpreparerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaxpreparerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
