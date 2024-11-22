import { TestBed } from '@angular/core/testing';
import { UserService } from '../Services/user.service';
import { UserFormValidator } from './userform.validator';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { apiInterceptor } from '../Interceptors/api.interceptor';

describe('UserFormValidator', () => {
  let userservice: jasmine.SpyObj<UserService>;
  beforeEach(() => {
    const spyobj = jasmine.createSpyObj<UserService>('UserService', [
      'calculateAge',
    ]);
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      providers: [{ provide: UserService, useValue: spyobj }],
    });

    userservice = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
  });

  it('should return an error on selecting the future date as the birthdate', () => {
    const dob = new FormControl('2024-11-30');
    const rest = UserFormValidator.pastDate(dob);
    expect(rest['futureDate'])
      .withContext('Should throw Error')
      .toEqual('Birthdate cannot be in the future');
  });

  it('should return null on selecting the valid past date', () => {
    const dob = new FormControl('1990-11-05');
    const rest = UserFormValidator.pastDate(dob);
    expect(rest).toEqual(null);
  });


  it("Should return null on selecting the valid date and calculates the age", () => {

    // mocking the userservice call
    userservice.calculateAge.and.returnValue(21)

    const forms = new FormGroup({
      DateOfBirth: new FormControl('2003-04-22'),
      Age: new FormControl(21)
    })
    const res = TestBed.runInInjectionContext(() =>
      UserFormValidator.checkAge()(forms.controls.Age)
    )
    expect(res).withContext("Should Return null due valid age").toBeNull()
    expect(userservice.calculateAge).toHaveBeenCalledOnceWith('2003-04-22')
  })

  it("Should return error WrongAge when age does not match with DateofBirth", () => {
    // mocking the userservice call
    userservice.calculateAge.and.returnValue(0)

    const forms = new FormGroup({
      DateOfBirth: new FormControl('2024-11-22'),
      Age: new FormControl(1)
    })
    const res = TestBed.runInInjectionContext(() =>
      UserFormValidator.checkAge()(forms.controls.Age)
    )
    expect(res["WrongAge"]).withContext("Should Return WrongAge").toBeTrue()
    expect(userservice.calculateAge).toHaveBeenCalledOnceWith('2024-11-22')
  })

  it("Should return null if one checkbox is selected", () => {
    const selected = new FormControl([true, false, false])
    const res = UserFormValidator.oneSelected(1)(selected)
    expect(res).withContext("Should be null selected one option").toBeNull()
  })

  it("Should return Oneselected error if the minimum number of items is not selected", () => {
    const selected = new FormControl([false, false, false])
    const res = UserFormValidator.oneSelected(1)(selected)
    expect(res["OneSelected"]).withContext("Should be null selected one option").toBeTrue()
  })

});
