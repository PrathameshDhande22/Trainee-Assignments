import { EventEmitter, inject, Injectable } from '@angular/core';
import { delay, map, Observable } from 'rxjs';
import { IUserDetails, ListUser } from '../Models/user';
import { HttpClient } from '@angular/common/http';
import dayjs from 'dayjs';
import { Message } from '../Models/message';
import { StateListCity } from '../Models/statecity';
import { ListInterest } from '../Models/interest';
import { BASE_URL } from '../app.module';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  // injecting the httpclient service
  private http: HttpClient = inject(HttpClient);
  // injecting the base url value
  url: string = inject(BASE_URL);

  notifyreferesh: EventEmitter<any> = new EventEmitter<any>();

  notify$: Observable<any> = this.notifyreferesh.asObservable();

  // Returns the list of the users.
  getUsers(): Observable<ListUser> {
    return this.http.get<ListUser>(`/api/user/users`).pipe(
      map((value) => {
        let user: ListUser = value;
        user.users.map((u) => {
          u.Profile = this.getImageUrl(u.Profile);
          u.FormattedDate = dayjs(u.DateOfBirth).format('DD-MMM-YYYY');
        });
        return user;
      })
    );
  }

  // using the filename getting the image url
  private getImageUrl(filename: string): string {
    return this.url + '/content/images/' + filename;
  }

  // calls the delete user by its number.
  deleteUser(userid: number): Observable<Message> {
    return this.http.delete(`/api/user/users/${userid}`);
  }

  // get the state and city
  getStateCity(): Observable<StateListCity> {
    return this.http.get<StateListCity>(`/api/user/getstateandcity`);
  }

  // get the interest list
  getInterests(): Observable<ListInterest> {
    return this.http.get<ListInterest>(`/api/user/interests`);
  }

  // calculates the age of the passed dateofbirth
  calculateAge(dateofbirthstring: string): number {
    const dateofbirth = new Date(dateofbirthstring);
    const today = new Date();

    // Calculate the difference in years
    let age = today.getFullYear() - dateofbirth.getFullYear();

    // Adjust if the birth date hasn't occurred yet this year
    const monthDifference = today.getMonth() - dateofbirth.getMonth();
    const dayDifference = today.getDate() - dateofbirth.getDate();

    if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
      age--;
    }
    return age;
  }

  // Adding the user by passing the formdata
  addUser(formdata: FormData): Observable<Message> {
    return this.http.post<Message>(`/api/user/register`, formdata);
  }

  // Updating the user details.
  updateUser(formdata: FormData, userid: number): Observable<Message> {
    return this.http.put<Message>(`/api/user/users/${userid}`, formdata);
  }

  // Getting the Details of the Single user
  getSingleUser(userid: number): Observable<IUserDetails> {
    return this.http.get<IUserDetails>(`/api/user/users/${userid}`).pipe(
      map((value) => {
        value.Profile = this.getImageUrl(value.Profile);
        return value;
      })
    );
  }
}
