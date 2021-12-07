import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateSiteComponent } from './add-update-site.component';

describe('AddUpdateSiteComponent', () => {
  let component: AddUpdateSiteComponent;
  let fixture: ComponentFixture<AddUpdateSiteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddUpdateSiteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUpdateSiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
