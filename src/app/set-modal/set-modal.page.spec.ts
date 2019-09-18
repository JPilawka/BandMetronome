import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetModalPage } from './set-modal.page';

describe('SetModalPage', () => {
  let component: SetModalPage;
  let fixture: ComponentFixture<SetModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetModalPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
