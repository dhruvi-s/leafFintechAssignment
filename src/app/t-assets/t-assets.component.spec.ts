import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TAssetsComponent } from './t-assets.component';

describe('TAssetsComponent', () => {
  let component: TAssetsComponent;
  let fixture: ComponentFixture<TAssetsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TAssetsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TAssetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
