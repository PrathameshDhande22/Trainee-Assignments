import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserService } from '../../Services/user.service';
import { UsersComponent } from './users.component';
import {
  Component,
  DebugElement,
  ElementRef,
  EventEmitter,
  input,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import { AlertboxComponent } from '../alertbox/alertbox.component';
import { LoaderComponent } from '../loader/loader.component';
import { UserlistingComponent } from '../userlisting/userlisting.component';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { ModalComponent } from '../modal/modal.component';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { ListInterest } from '../../Models/interest';
import { StateListCity } from '../../Models/statecity';
import { ErrorMessageComponent } from '../error-message/error-message.component';
import { IUserDetails } from '../../Models/user';
import { By } from '@angular/platform-browser';
import { FormArray, FormControl } from '@angular/forms';

const mockinterests: ListInterest = {
  interests: [
    {
      InterestId: 1,
      Interest: 'Technology',
    },
    {
      InterestId: 2,
      Interest: 'Science',
    },
  ],
};

const statecitylistmock: StateListCity = {
  Gujarat: ['Ahemdabad', 'Rajkot'],
  Maharashtra: ['Mumbai', 'Pune'],
};

const mockdata = {
  FirstName: 'John',
  LastName: 'Doe',
  Email: 'john.doe@example.com',
  Password: 'Password@1',
  DateOfBirth: '2003-04-22',
  Age: 21,
  Gender: 'Male',
  State: 'Maharashtra',
  City: 'Mumbai',
  Address: '123 Street, Mumbai',
  PhoneNo: '1234567890',
  ProfileImage: 'c:/fakepath/sample.jgp',
  IdofInterests: [true, false], // Boolean array representing selected interests
};

const mockuser: IUserDetails = {
  Id: 25,
  FirstName: 'Prathamesh',
  LastName: 'Systenics',
  Email: 'billi@cat.com',
  Password: 'Prathmesh@1',
  DateOfBirth: '2023-11-14T00:00:00',
  Age: 1,
  Gender: 'Male',
  State: 'Gujarat',
  City: 'Ahmedabad',
  Address: 'Boisar',
  PhoneNo: '8657295925',
  Profile: '72e0bd2d-d947-4494-8eff-3c21d89f2869.jpg',
  Interests: [
    {
      InterestId: 1,
      Interest: 'Traveling',
    },
    {
      InterestId: 2,
      Interest: 'Photography',
    },
    {
      InterestId: 3,
      Interest: 'Cooking',
    },
    {
      InterestId: 4,
      Interest: 'Reading',
    },
    {
      InterestId: 11,
      Interest: 'Volunteering',
    },
  ],
  IdofInterests: null,
  ListofInterestId: [1, 2, 3, 4, 11],
  ProfileImage: null,
  IsDeleted: false,
};

@Component({ selector: 'app-userlisting' })
class MockUserListing {}

describe('Users Component', () => {
  let component: UsersComponent;
  let userservice: jasmine.SpyObj<UserService>;
  let fixture: ComponentFixture<UsersComponent>;
  let debugEle: DebugElement;
  let routermock: jasmine.SpyObj<Router>;
  let activatedroutemock: jasmine.SpyObj<ActivatedRoute>;
  let paramMapSubject: BehaviorSubject<any>;

  beforeEach(() => {
    const spyobj = jasmine.createSpyObj<UserService>(
      'UserService',
      [
        'addUser',
        'notify$',
        'notifyreferesh',
        'getSingleUser',
        'getInterests',
        'getStateCity',
        'calculateAge',
        'updateUser',
      ],
      { notifyreferesh: new EventEmitter<any>() }
    );

    paramMapSubject = new BehaviorSubject({
      get: (key: string) => (key === 'id' ? '1' : null),
    });

    const spyobjrouter = jasmine.createSpyObj<Router>('Router', ['navigate']);
    const spyobjactivatedroute = jasmine.createSpyObj<ActivatedRoute>(
      'ActivatedRoute',
      ['paramMap'],
      { paramMap: paramMapSubject.asObservable() }
    );

    TestBed.configureTestingModule({
      declarations: [
        UsersComponent,
        AlertboxComponent,
        LoaderComponent,
        MockUserListing,
        ModalComponent,
        ErrorMessageComponent,
      ],
      providers: [
        { provide: UserService, useValue: spyobj },
        { provide: Router, useValue: spyobjrouter },
        { provide: ActivatedRoute, useValue: spyobjactivatedroute },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });
    fixture = TestBed.createComponent(UsersComponent);
    userservice = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    component = fixture.componentInstance;
    debugEle = fixture.debugElement;
    routermock = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    activatedroutemock = TestBed.inject(
      ActivatedRoute
    ) as jasmine.SpyObj<ActivatedRoute>;
  });

  it('Should Create component', () => {
    expect(component).toBeTruthy();
  });

  it('Should fetch state/city and interests', () => {
    expect(component.state).toEqual([]);
    expect(component.interestlist).toBeNull();

    userservice.getInterests.and.returnValue(of(mockinterests));
    userservice.getStateCity.and.returnValue(of(statecitylistmock));
    userservice.getSingleUser.and.returnValue(of(mockuser));

    paramMapSubject.next({
      get: (key: string) => (key === 'id' ? '25' : null),
    });
    component.ngOnInit();

    expect(component.userid).toBe(25);
    expect(component.statecitylist).toEqual(statecitylistmock);
    expect(component.interestlist).toEqual(mockinterests);
    expect(component.state).toEqual(Object.keys(statecitylistmock));
    expect(userservice.getSingleUser).toHaveBeenCalledOnceWith(25);
    expect(component.reuserregisterform.controls.FirstName.value).toEqual(
      'Prathamesh'
    );
  });

  it('Should show alertbox when user is not found and navigate to user', () => {
    userservice.getInterests.and.returnValue(of(mockinterests));
    userservice.getStateCity.and.returnValue(of(statecitylistmock));
    userservice.getSingleUser.and.returnValue(
      throwError(() => new Error('Error'))
    );

    paramMapSubject.next({
      get: (key: string) => (key === 'id' ? '334' : null),
    });
    component.ngOnInit();

    expect(component.isAlertBoxOpen).toBeTrue();
    expect(component.message).toEqual('User Does Not Exist');
    expect(component.alerttype).toEqual('Warning');
    expect(routermock.navigate).toHaveBeenCalledOnceWith(['user']);
  });

  it('Should show alertbox when user id is entered wrongly and navigate to user', () => {
    userservice.getInterests.and.returnValue(of(mockinterests));
    userservice.getStateCity.and.returnValue(of(statecitylistmock));
    userservice.getSingleUser.and.returnValue(
      throwError(() => new Error('Error'))
    );
    paramMapSubject.next({
      get: (key: string) => (key === 'id' ? '334dsfd' : null),
    });
    component.ngOnInit();
    expect(routermock.navigate).toHaveBeenCalledOnceWith(['user']);
  });

  it('Should show alertbox when state/city and interests failed to load', () => {
    expect(component.isAlertBoxOpen).toBeFalse();
    userservice.getInterests.and.returnValue(
      throwError(() => new Error('Error'))
    );
    userservice.getStateCity.and.returnValue(
      throwError(() => new Error('Error'))
    );
    component.ngOnInit();

    expect(component.isAlertBoxOpen).toBeTrue();
    expect(component.message).toEqual(
      'Failed to Load State, City and Interests'
    );
    expect(component.alerttype).toEqual('Danger');
  });

  it('Should set the flag as close when the alertbox emits the close value', () => {
    expect(component.isAlertBoxOpen).toBeFalse();
    component.isAlertBoxOpen = true;
    component.onAlertBoxClose();
    fixture.detectChanges();

    expect(component.isAlertBoxOpen).toBeTrue();
  });

  it('Should toggle the eye button and change the input type of password from password to text', () => {
    fixture.detectChanges();
    let button: DebugElement = debugEle.query(By.css('#toggle-password-btn'));
    let eyespan: DebugElement = button.children[0];
    let passwordinput = debugEle.query(By.css('#password'));
    expect(passwordinput.attributes['type']).toBe('password');
    expect(eyespan.classes['glyphicon-eye-open']).toBeTrue();
    expect(eyespan.classes['glyphicon-eye-close']).toBeUndefined();

    component.toggleEye(passwordinput.nativeElement);
    fixture.detectChanges();
    expect(passwordinput.nativeElement.type).toBe('text');
    expect(eyespan.classes['glyphicon-eye-close']).toBeTrue();
  });

  it('Should toggle the eye button and change the input type of password from text to password', () => {
    fixture.detectChanges();
    let button: DebugElement = debugEle.query(By.css('#toggle-password-btn'));
    let eyespan: DebugElement = button.children[0];
    let passwordinput = debugEle.query(By.css('#password'));
    component.toggleEye(passwordinput.nativeElement);
    component.toggleEye(passwordinput.nativeElement);
    fixture.detectChanges();
    expect(passwordinput.nativeElement.type).toBe('password');
    expect(eyespan.classes['glyphicon-eye-close']).toBeUndefined();
  });

  it('Should remove the uploaded image', () => {
    fixture.detectChanges();
    component.uploadedimage = new File([''], 'sample.jpg');
    component.uploadedimageurl = 'uploadedimage';

    component.removeUploadedImage();
    expect(component.uploadedimageurl).toBe('');
    expect(component.uploadedimage).toBeNull();
    expect(component.edituploadedimageurl).toBe('');
  });

  it('Should remove the uploaded image and return the orginal image', () => {
    fixture.detectChanges();
    component.uploadedimage = new File([''], 'sample.jpg');
    component.uploadedimageurl = 'uploadedimage';
    component.edituploadedimageurl = 'editimage';
    expect(component.edituploadedimageurl).toEqual('editimage');

    component.removeUploadedImage();
    expect(component.uploadedimageurl).toBe('');
    expect(component.uploadedimage).toBeNull();
    expect(component.edituploadedimageurl).toBe('editimage');
  });

  it('Should change the city according to the selected state', () => {
    userservice.getInterests.and.returnValue(of(mockinterests));
    userservice.getStateCity.and.returnValue(of(statecitylistmock));
    userservice.getSingleUser.and.returnValue(of(mockuser));

    paramMapSubject.next({
      get: (key: string) => (key === 'id' ? '25' : null),
    });
    fixture.detectChanges();

    let select: HTMLSelectElement = debugEle.query(
      By.css('#state')
    ).nativeElement;
    select.value = 'Gujarat';
    component.changeCityAccordingtoState(select);
    expect(component.cities).toEqual(statecitylistmock['Gujarat']);
    expect(component.reuserregisterform.controls.City.value).toBe('');
  });

  it('Should reset the form on clicking the reset button', () => {
    userservice.getInterests.and.returnValue(of(mockinterests));
    userservice.getStateCity.and.returnValue(of(statecitylistmock));
    userservice.getSingleUser.and.returnValue(of(mockuser));

    paramMapSubject.next({
      get: (key: string) => (key === 'id' ? '25' : null),
    });
    fixture.detectChanges();

    component.reuserregisterform.patchValue(mockdata);
    component.uploadedimage = new File([''], 'sample.jpg');
    expect(component.reuserregisterform.controls.Age.value).toEqual(21);
    component.resetForm();
    expect(component.uploadedimage).toBeNull();
    expect(component.uploadedimageurl).toBe('');
    expect(component.reuserregisterform.controls.FirstName.value).toBeNull();
  });

  it('Should not be allowed to enter characters in phone no', () => {
    fixture.detectChanges();
    let inputPhone: HTMLInputElement = debugEle.query(
      By.css('#phoneno')
    ).nativeElement;
    let mockevent = new KeyboardEvent('keypress', { key: 'a' });
    spyOn(mockevent, 'preventDefault');

    component.DontAllowCharacter(mockevent, inputPhone);
    expect(mockevent.preventDefault).toHaveBeenCalledTimes(1);
  });

  it('Should auto set the value of the age on dateof birth selection', () => {
    fixture.detectChanges();

    let inputele: HTMLInputElement = debugEle.query(
      By.css('#dob')
    ).nativeElement;
    inputele.value = '2003-04-22';
    userservice.calculateAge.and.returnValue(21);

    component.onDobChange(inputele);
    expect(userservice.calculateAge).toHaveBeenCalledOnceWith(inputele.value);
    expect(component.reuserregisterform.controls.Age.value).toBe(21);
  });

  it('Should validate the image uploaded', () => {
    fixture.detectChanges();

    const file = new File(['dummy content'], 'test.jpg', {
      type: 'image/jpeg',
    });
    const mockInput = component.imageInput.nativeElement as HTMLInputElement;

    spyOnProperty(mockInput, 'files', 'get').and.returnValue([file] as any);
    component.fileUpload();

    // Assert
    expect(component.uploadedimage).toBe(file);
    expect(component.uploadedimageurl).toBeTruthy();
    expect(mockInput.classList.contains('input-error')).toBeFalse();
  });

  it('Should validate wrong image uploaded ', () => {
    fixture.detectChanges();

    const file = new File(['dummy content'], 'test.jpg', {
      type: 'image/webp',
    });
    const mockInput = component.imageInput.nativeElement as HTMLInputElement;

    spyOnProperty(mockInput, 'files', 'get').and.returnValue([file] as any);
    component.fileUpload();

    expect(component.uploadedimage).toBeNull();
    expect(component.uploadedimageurl).toEqual('');
    expect(mockInput.classList.contains('input-error')).toBeTrue();
    expect(component.reuserregisterform.controls.ProfileImage.errors).toEqual({
      wrongfileupload: true,
    });
  });

  it('Should validate when no file are uploaded but having the edit image file', () => {
    fixture.detectChanges();

    component.uploadedimage = new File([''], 'filename.jpg', {
      type: 'image/jpg',
    });

    expect(component.reuserregisterform.controls.ProfileImage.errors).toEqual({
      required: true,
    });

    component.fileUpload();
    expect(
      component.reuserregisterform.controls.ProfileImage.errors
    ).toBeNull();
  });

  it('Should throw error when the file uploading is cancel', () => {
    fixture.detectChanges();

    component.uploadedimage = null;
    component.edituploadedimageurl = '';
    const mockInput = component.imageInput.nativeElement as HTMLInputElement;
    component.fileUploadCancel();
    expect(component.isFileDialogClosed).toBeTrue();
    expect(mockInput.classList.contains('input-error')).toBeTrue();
  });

  it('Should submit the valid form to add the user', () => {
    component.interestlist = mockinterests;
    component.statecitylist = statecitylistmock;
    component.interestformarray = new FormArray([
      new FormControl(true),
      new FormControl(false),
    ]);

    component.uploadedimage = new File([''], 'filename.jpg', {
      type: 'image/jpg',
    });
    component.reuserregisterform.setControl(
      'IdofInterests',
      component.interestformarray
    );
    component.reuserregisterform.patchValue(mockdata);
    component.reuserregisterform.controls.Age.setErrors(null);
    spyOn(userservice.notifyreferesh, 'emit');

    userservice.addUser.and.returnValue(
      of({ message: 'User Registered Successfully' })
    );
    expect(component.reuserregisterform.valid).toBeTrue();

    fixture.detectChanges();
    component.submitForm();
    expect(userservice.notifyreferesh.emit).toHaveBeenCalledOnceWith({
      isAlertBoxOpen: true,
      message: 'User Registered Successfully',
      alerttype: 'Success',
    });
  });

  it('Should throw error when registering the user', () => {
    component.interestlist = mockinterests;
    component.statecitylist = statecitylistmock;
    component.interestformarray = new FormArray([
      new FormControl(true),
      new FormControl(false),
    ]);

    component.uploadedimage = new File([''], 'filename.jpg', {
      type: 'image/jpg',
    });
    component.reuserregisterform.setControl(
      'IdofInterests',
      component.interestformarray
    );
    component.reuserregisterform.patchValue(mockdata);
    component.reuserregisterform.controls.Age.setErrors(null);

    userservice.addUser.and.returnValue(throwError(() => new Error('Error')));
    expect(component.reuserregisterform.valid).toBeTrue();

    fixture.detectChanges();
    component.submitForm();
    expect(component.isAlertBoxOpen).toBeTrue();
    expect(component.message).toEqual(
      'Some Error Occurred While Registering the User'
    );
  });

  it('Should update the user when the inputs are valid', () => {
    component.interestlist = mockinterests;
    component.statecitylist = statecitylistmock;
    component.interestformarray = new FormArray([
      new FormControl(true),
      new FormControl(false),
    ]);

    component.uploadedimage = new File([''], 'filename.jpg', {
      type: 'image/jpg',
    });
    component.reuserregisterform.setControl(
      'IdofInterests',
      component.interestformarray
    );
    component.reuserregisterform.patchValue(mockdata);
    component.reuserregisterform.controls.Age.setErrors(null);
    component.userid = 25;
    spyOn(userservice.notifyreferesh, 'emit');
    userservice.updateUser.and.returnValue(
      of({ message: 'User Updated Successfully' })
    );
    expect(component.reuserregisterform.valid).toBeTrue();

    fixture.detectChanges();
    component.submitForm();
    expect(userservice.notifyreferesh.emit).toHaveBeenCalledOnceWith({
      isAlertBoxOpen: true,
      message: 'User Updated Successfully!',
      alerttype: 'Success',
    });
    expect(routermock.navigate).toHaveBeenCalledOnceWith(['user']);
  });

  it('Should return all the error when the inputs in the form are invalid', () => {
    fixture.detectChanges();

    component.submitForm()

    expect(component.reuserregisterform.invalid).toBeTrue()
    expect(component.reuserregisterform.controls.FirstName.touched).toBeTrue()
  });

  it("Should not throw error when the image is not uploaded while in edit form",()=>{
    fixture.detectChanges()

    component.edituploadedimageurl="filename.jpg"
    component.submitForm()

    expect(component.reuserregisterform.controls.FirstName.touched).toBeTrue()
    expect(component.reuserregisterform.controls.ProfileImage.errors).toBeFalsy()
  })
});
