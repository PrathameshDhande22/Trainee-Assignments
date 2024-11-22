import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ErrorMessageComponent } from './error-message.component';
import { DebugElement } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

describe('ErrorMessageComponent', () => {
  let component: ErrorMessageComponent;
  let fixture: ComponentFixture<ErrorMessageComponent>;
  let debugEle: DebugElement;
  let email: FormControl;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ErrorMessageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ErrorMessageComponent);
    component = fixture.componentInstance;
    debugEle = fixture.debugElement;

    email = new FormControl('', [Validators.email, Validators.required]);
    // setting the inputs
    fixture.componentRef.setInput('control', email);
    fixture.componentRef.setInput('errorMessages', {
      required: 'These Field is required',
      email: 'Enter Correct Email',
    });
    fixture.detectChanges();
  });

  it('Should Create the component', () => {
    expect(component).withContext('should create the component').toBeTruthy();
  });

  it('Should return the error required when the text is not entered', () => {
    expect(component.errorKeys).toEqual(['required']);
    expect(component.getErrorMessage('required')).toEqual(
      'These Field is required'
    );
  });

  it('Should return the email error message when the entered email is wrong', () => {
    email.setValue('emd');
    fixture.detectChanges();
    expect(component.errorKeys).toEqual(['email']);
    expect(component.getErrorMessage('email')).toEqual('Enter Correct Email');
  });
});
