import { Component, inject } from '@angular/core';
import { AlertType } from '../alertbox/alertbox.component';
import { UserService } from '../../Services/user.service';

@Component({
  selector: 'app-showalert',
  templateUrl: './showalert.component.html',
  styleUrl: './showalert.component.css'
})
export class ShowalertComponent {
  message: string = '';
  isAlertBoxOpen: boolean = false;
  alerttype: AlertType = 'Success';

  // injecting the user service for notifying the change
  userservice: UserService = inject(UserService)

  onAlertBoxClose(): void {
    this.isAlertBoxOpen = false;
  }

  ngOnInit(): void {
    this.userservice.notify$.subscribe((data) => {
      this.alerttype = data.alerttype;
      this.isAlertBoxOpen = data.isAlertBoxOpen;
      this.message = data.message
    })
  }
}
