import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserlistingComponent } from './userlisting.component';
import {
  Component,
  DebugElement,
  EventEmitter,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import { UserService } from '../../Services/user.service';
import { of, throwError } from 'rxjs';
import { AlertboxComponent } from '../alertbox/alertbox.component';
import { ModalComponent } from '../modal/modal.component';

const mockuser = {
  users: [
    {
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
      InterestsId: null,
      ListofInterestId: [1, 2, 3, 4, 11],
      ProfileImage: null,
      IsDeleted: false,
      CreatedOn: '2024-11-13T11:11:35.26',
      UpdatedOn: '2024-11-14T15:43:14.653',
      DeletedOn: '0001-01-01T00:00:00',
    },
  ],
  count: 0,
};

describe('UserListing Component', () => {
  let component: UserlistingComponent;
  let fixture: ComponentFixture<UserlistingComponent>;
  let debugEle: DebugElement;
  let userservice: jasmine.SpyObj<UserService>;

  beforeEach(() => {
    const spyobj = jasmine.createSpyObj<UserService>(
      'UserService',
      ['getUsers', 'notify$', 'deleteUser', 'notifyreferesh'],
      { notify$: of('data'), notifyreferesh: new EventEmitter<any>() }
    );

    TestBed.configureTestingModule({
      declarations: [UserlistingComponent, AlertboxComponent, ModalComponent],
      providers: [{ provide: UserService, useValue: spyobj }],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(UserlistingComponent);
    userservice = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    component = fixture.componentInstance;
    debugEle = fixture.debugElement;
  });

  it('Should create component', () => {
    expect(component).toBeTruthy();
  });

  it('Should load the data on component loading', () => {
    expect(component.isLoading).toBeTrue();
    userservice.getUsers.and.returnValue(of(mockuser));
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.isLoading).toBeFalse();
    expect(component.userlisting).toBe(mockuser);
  });

  it('Should display alertbox when fetching the users got error', () => {
    expect(component.isLoading).toBeTrue();
    userservice.getUsers.and.returnValue(throwError(() => new Error('Error')));
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.isLoading).toBeFalse();
    expect(component.userlisting).toEqual({ users: [], count: 0 });
    expect(component.alerttype).toBe('Danger');
    expect(component.message).toEqual(
      'Something Went Wrong while Fetching the User.'
    );
    expect(component.isAlertBoxOpen).toBeTrue();
  });

  it('Should display modal when the delete button is clicked', () => {
    expect(component.selectedUser)
      .withContext('Selected User Should be null before displaying the user')
      .toBeNull();
    userservice.getUsers.and.returnValue(of(mockuser));
    component.ngOnInit();
    fixture.detectChanges();
    component.onDelete(mockuser.users[0]);
    expect(component.isModalOpen).toBeTrue();
    expect(component.selectedUser).toEqual(mockuser.users[0]);
  });

  it('Should close the alertbox when the alert is closed', () => {
    expect(component.isAlertBoxOpen).toBeFalse();
    component.onAlertClose();
    expect(component.isAlertBoxOpen).toBeFalse();
  });

  it('Should display the modal when the delete button is clicked of the specific user', () => {
    expect(component.isAlertBoxOpen).toBeFalse();
    expect(component.message).toBe('');
    spyOn(userservice.notifyreferesh, 'emit');
    userservice.deleteUser.and.returnValue(
      of({ message: 'User Deleted SuccessFully' })
    );
    component.selectedUser = mockuser.users[0];
    component.modalConfirm();

    expect(userservice.deleteUser).toHaveBeenCalledWith(
      component.selectedUser.Id
    );
    expect(component.isAlertBoxOpen).toBeTrue();
    expect(userservice.notifyreferesh.emit).toHaveBeenCalledTimes(1);
    expect(component.alerttype).toBe('Success');
    expect(component.message).toBe('User Deleted SuccessFully');
    expect(component.isModalOpen).toBeFalse();
  });

  it('should display the alertbox with danger when deletion is unsuccessful', () => {
    expect(component.isAlertBoxOpen).toBeFalse();
    spyOn(userservice.notifyreferesh, 'emit');

    userservice.deleteUser.and.returnValue(
      throwError(() => new Error('Error'))
    );
    component.selectedUser = mockuser.users[0];
    component.modalConfirm();
    expect(userservice.deleteUser).toHaveBeenCalledWith(mockuser.users[0].Id);
    expect(userservice.notifyreferesh.emit).toHaveBeenCalledTimes(0);
    expect(component.alerttype).toEqual('Danger');
    expect(component.message).toEqual(
      'Some Thing Went Wrong while Deleting the User.'
    );
    expect(component.isAlertBoxOpen).toBeTrue();
  });
});
