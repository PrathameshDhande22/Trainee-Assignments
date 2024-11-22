import {
  HttpErrorResponse,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { UserService } from './user.service';
import { apiInterceptor } from '../Interceptors/api.interceptor';
import { BASE_URL } from '../app.module';

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

describe('UserService', () => {
  let userService: UserService;
  let httpControl: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: BASE_URL, useValue: 'http://localhost:34415' },
        provideHttpClient(withInterceptors([apiInterceptor])),
        provideHttpClientTesting(),
      ],
    });

    userService = TestBed.inject(UserService);
    httpControl = TestBed.inject(HttpTestingController);
  });

  afterAll(() => {
    httpControl.verify();
  });

  it('should get all users', () => {
    userService.getUsers().subscribe((users) => {
      expect(users).toBeTruthy();

      users.users.forEach((value) => {
        expect(value.FormattedDate).toEqual('14-Nov-2023');
      });
    });

    let req = httpControl.expectOne('http://localhost:34415/api/user/users');
    expect(req.request.method).toEqual('GET');
    req.flush(mockuser);
  });

  it('Should Delete User', () => {
    userService.deleteUser(26).subscribe((data) => {
      expect(data.message).toEqual('User Deleted Successfully');
    });

    let req = httpControl.expectOne('http://localhost:34415/api/user/users/26');
    expect(req.request.method).toEqual('DELETE');
    req.flush({
      message: 'User Deleted Successfully',
    });
  });

  it('Should throw error when user not found when deletetion', () => {
    userService.deleteUser(26).subscribe({
      next: (data) => {
        fail('Should Fail these test got the successful data');
      },
      error: (err: HttpErrorResponse) => {
        expect(err.status).toEqual(404);
      },
    });

    let req = httpControl.expectOne('http://localhost:34415/api/user/users/26');
    expect(req.request.method).toEqual('DELETE');
    req.flush(
      {
        message: 'User not Found',
      },
      { status: 404, statusText: 'Not Found' }
    );
  });

  it('Should get the list of interests', () => {
    userService.getInterests().subscribe({
      next: (data) => {
        expect(data).toBeTruthy();
        expect(data.interests.length).toEqual(2);
      },
      error: (err: HttpErrorResponse) => {
        fail('Should not Fail');
      },
    });

    let req = httpControl.expectOne(
      'http://localhost:34415/api/user/interests'
    );

    expect(req.request.method)
      .withContext('should be GET Request')
      .toEqual('GET');

    req.flush({
      interests: [
        {
          InterestId: 1,
          Interest: 'Traveling',
        },
        {
          InterestId: 2,
          Interest: 'Photography',
        },
      ],
    });
  });

  it('Should get the object with key as state with its cities in array', () => {
    userService.getStateCity().subscribe({
      next: (data) => {
        expect(data).toBeTruthy();
      },
      error: (err: HttpErrorResponse) => {
        fail('Should not Fail');
      },
    });

    let req = httpControl.expectOne(
      'http://localhost:34415/api/user/getstateandcity'
    );

    expect(req.request.method)
      .withContext('should be GET Request')
      .toEqual('GET');

    req.flush({
      Bihar: ['Bhagalpur', 'Gaya', 'Muzaffarpur', 'Patna'],
      Gujarat: ['Ahmedabad', 'Rajkot', 'Surat', 'Vadodara'],
    });
  });

  it('Should calculate the age properly by dateofbirth', () => {
    expect(userService.calculateAge('2023-11-06')).toEqual(1);
    expect(userService.calculateAge('1990-12-15')).toEqual(33);
  });

  it('Should return the single user by its id', () => {
    userService.getSingleUser(25).subscribe({
      next: (data) => {
        expect(data).toBeTruthy();
        expect(data.Id).toEqual(25);
      },
      error: (err: HttpErrorResponse) => {
        fail('Should not Fail');
      },
    });

    let req = httpControl.expectOne('http://localhost:34415/api/user/users/25');

    expect(req.request.method)
      .withContext('should be GET Request')
      .toEqual('GET');

    req.flush(mockuser.users[0]);
  });

  it('Should add the user', () => {
    const data = {
      Id: 1,
      FirstName: 'John',
      LastName: 'Doe',
      Email: 'john.doe@example.com',
      Password: 'password123',
      DateOfBirth: '1990-01-01',
      Age: 34,
      Gender: 'Male',
      State: 'Maharashtra', // Replace with your `State` object structure
      City: 'Mumbai', // Replace with your `City` object structure
      Address: '123 Main Street, Los Angeles, CA',
      PhoneNo: '1234567890',
      Profile: 'This is a profile description',
      ProfileImage: new File(['dummy content'], 'profile.jpg', {
        type: 'image/jpeg',
      }),
      IdofInterests: '[1, 2]',
      IsDeleted: false,
      FormattedDate: '14-Nov-2024',
      ListofInterestId: [101, 102],
    };

    const formData = new FormData();

    formData.append('Id', data.Id.toString());
    formData.append('FirstName', data.FirstName);
    formData.append('LastName', data.LastName);
    formData.append('Email', data.Email);
    formData.append('Password', data.Password);
    formData.append('DateOfBirth', data.DateOfBirth);
    formData.append('Age', data.Age.toString());
    formData.append('Gender', data.Gender);
    formData.append('State', data.State);
    formData.append('City', JSON.stringify(data.City));
    formData.append('Address', data.Address);
    formData.append('PhoneNo', data.PhoneNo);
    formData.append('ProfileImage', data.ProfileImage);
    formData.append('IdofInterests', data.IdofInterests);

    userService.addUser(formData).subscribe({
      next: (data) => {
        expect(data).toBeTruthy();
        expect(data.message).toEqual('User registered Successfully');
      },
      error: (err: HttpErrorResponse) => {
        fail('Should not Fail');
      },
    });

    let req = httpControl.expectOne('http://localhost:34415/api/user/register');

    expect(req.request.method)
      .withContext('should be POST Request')
      .toEqual('POST');

    req.flush({
      message: 'User registered Successfully',
    });
  });

  it('Should update the user by collecting the data in the form of formData by specified user id', () => {
    const data = {
      Id: 1,
      FirstName: 'John',
      LastName: 'Doe',
      Email: 'john.doe@example.com',
      Password: 'password123',
      DateOfBirth: '1990-01-01',
      Age: 34,
      Gender: 'Male',
      State: 'Maharashtra', // Replace with your `State` object structure
      City: 'Mumbai', // Replace with your `City` object structure
      Address: '123 Main Street, Los Angeles, CA',
      PhoneNo: '1234567890',
      Profile: 'This is a profile description',
      ProfileImage: new File(['dummy content'], 'profile.jpg', {
        type: 'image/jpeg',
      }),
      IdofInterests: '[1, 2]',
      IsDeleted: false,
      FormattedDate: '14-Nov-2024',
      ListofInterestId: [101, 102],
    };

    const formData = new FormData();

    formData.append('Id', data.Id.toString());
    formData.append('FirstName', data.FirstName);
    formData.append('LastName', data.LastName);
    formData.append('Email', data.Email);
    formData.append('Password', data.Password);
    formData.append('DateOfBirth', data.DateOfBirth);
    formData.append('Age', data.Age.toString());
    formData.append('Gender', data.Gender);
    formData.append('State', data.State);
    formData.append('City', JSON.stringify(data.City));
    formData.append('Address', data.Address);
    formData.append('PhoneNo', data.PhoneNo);
    formData.append('ProfileImage', data.ProfileImage);
    formData.append('IdofInterests', data.IdofInterests);

    userService.updateUser(formData, 1).subscribe({
      next: (data) => {
        expect(data).toBeTruthy();
        expect(data.message).toEqual('User updated Successfully');
      },
      error: (err: HttpErrorResponse) => {
        fail('Should not Fail');
      },
    });

    expect(data.Id)
      .withContext('User Id must be equal to update the user')
      .toEqual(1);
    let req = httpControl.expectOne('http://localhost:34415/api/user/users/1');

    expect(req.request.method)
      .withContext('should be PUT Request')
      .toEqual('PUT');

    req.flush({
      message: 'User updated Successfully',
    });
  });
});
