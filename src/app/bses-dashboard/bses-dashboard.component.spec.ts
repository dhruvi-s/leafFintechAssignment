import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BsesDashboardComponent } from './bses-dashboard.component';

describe('BsesDashboardComponent', () => {
  let component: BsesDashboardComponent;
  let fixture: ComponentFixture<BsesDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BsesDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BsesDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
