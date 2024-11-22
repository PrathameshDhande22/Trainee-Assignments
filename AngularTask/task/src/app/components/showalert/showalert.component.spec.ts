import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShowalertComponent } from './showalert.component';
import { DebugElement } from '@angular/core';
import { UserService } from '../../Services/user.service';
import { of } from 'rxjs';
import { AppComponent } from '../../app.component';
import { AlertboxComponent } from '../alertbox/alertbox.component';

describe('ShowAlertComponent', () => {
  let component: ShowalertComponent;
  let fixture: ComponentFixture<ShowalertComponent>;
  let debugEle: DebugElement;
  let userservice: jasmine.SpyObj<UserService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj<UserService>(
      'UserService',
      ['notifyreferesh'],
      {
        notify$: of({
          message: 'User Registered Successfully',
          isAlertBoxOpen: true,
          alerttype: 'Success',
        }),
      }
    );

    TestBed.configureTestingModule({
      declarations: [ShowalertComponent, AlertboxComponent],
      providers: [{ provide: UserService, useValue: spy }],
    });

    userservice = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    fixture = TestBed.createComponent(ShowalertComponent);
    component = fixture.componentInstance;
    debugEle = fixture.debugElement;
    fixture.detectChanges();
  });

  it('Should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('Should close the alertbox when clicked on close button', () => {
    expect(component.isAlertBoxOpen).toBeTrue();

    component.onAlertBoxClose();
    expect(component.isAlertBoxOpen).toBeFalse();
  });
});
