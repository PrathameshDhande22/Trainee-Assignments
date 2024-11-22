import {
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { City, State, StateListCity } from '../../Models/statecity';
import { forkJoin } from 'rxjs';
import { UserService } from '../../Services/user.service';
import { ListInterest } from '../../Models/interest';
import { AlertType } from '../alertbox/alertbox.component';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { UserFormValidator } from '../../Validators/userform.validator';
import dayjs from 'dayjs';
import { ActivatedRoute, Router } from '@angular/router';

export interface UserRegisterForm {
  FirstName: FormControl<string | null>;
  LastName: FormControl<string | null>;
  Email: FormControl<string | null>;
  Password: FormControl<string | null>;
  DateOfBirth: FormControl<string | null>;
  Age: FormControl<number | null>;
  Gender: FormControl<string | null>;
  State: FormControl<State | null>;
  City: FormControl<City | null>;
  Address: FormControl<string | null>;
  PhoneNo: FormControl<string | null>;
  ProfileImage: FormControl<File | string | null>;
  IdofInterests: FormArray<FormControl<boolean | null>>;
}

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
})
export class UsersComponent implements OnInit {
  // injecting the user service
  private userservice: UserService = inject(UserService);

  // injecting the activated route
  private activeroute: ActivatedRoute = inject(ActivatedRoute);

  // injecting the router
  private router: Router = inject(Router);

  // storing the user id
  userid: number = null;

  // for storing the interest and state cities.
  statecitylist: StateListCity = {};
  interestlist: ListInterest = null as any;
  state: State[] = [];
  cities: City[] = [];

  // variables and properties related to alert box
  message: string = '';
  isAlertBoxOpen: boolean = false;
  alerttype: AlertType = 'Success';

  // to show the loader
  loadertoshow: boolean = false;

  // property to store the uploaded image
  uploadedimage: File | null = null;
  uploadedimageurl: string = '';
  isFileDialogClosed: boolean = false;

  // getting the image of the uploaded while in edit mode
  edituploadedimageurl: string | null = '';

  // get the input view children
  @ViewChild('profileimageinputfile')
  imageInput: ElementRef<HTMLInputElement> = null as any;

  // creating the reactive forms
  interestformarray = new FormArray<FormControl<boolean>>(
    [],
    [UserFormValidator.oneSelected(1)]
  );

  // max date or current date not able to select the future date
  maxDate: string = dayjs().subtract(1, 'year').format('YYYY-MM-DD');

  reuserregisterform: FormGroup<UserRegisterForm> =
    new FormGroup<UserRegisterForm>({
      FirstName: new FormControl<string>('', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z]+$/),
      ]),
      LastName: new FormControl<string>('', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z]+$/),
      ]),
      Email: new FormControl<string>('', [
        Validators.required,
        Validators.email,
      ]),
      Password: new FormControl<string>('', [
        Validators.required,
        Validators.pattern(
          /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
        ),
      ]),
      DateOfBirth: new FormControl<string | null>(null, [
        Validators.required,
        UserFormValidator.pastDate,
      ]),
      Age: new FormControl<number>(0, [
        Validators.required,
        UserFormValidator.checkAge(),
      ]),
      Gender: new FormControl<string>('Male', [Validators.required]),
      State: new FormControl<State | null>('', [Validators.required]),
      City: new FormControl<City | null>('', [Validators.required]),
      Address: new FormControl<string | null>('', [Validators.required]),
      PhoneNo: new FormControl<string | null>('', [
        Validators.required,
        Validators.pattern(/^[0-9]{10}$/),
      ]),
      ProfileImage: new FormControl(null, [Validators.required]),
      IdofInterests: this.interestformarray,
    });

  onAlertBoxClose(): void {
    this.isAlertBoxOpen = false;
  }

  // remove the image selected
  removeUploadedImage(): void {
    this.uploadedimage = null;
    this.uploadedimageurl = '';
    this.imageInput.nativeElement
      ? (this.imageInput.nativeElement.value = null)
      : null;
    if (!this.edituploadedimageurl) {
      this.isFileDialogClosed = true;
      this.imageInput.nativeElement.classList.add('input-error');
    }
    this.reuserregisterform.controls.ProfileImage.reset();
    this.reuserregisterform.controls.ProfileImage.markAllAsTouched();
  }

  setAlerts(open: boolean, message: string, alerttype: AlertType): void {
    this.isAlertBoxOpen = open;
    this.alerttype = alerttype;
    this.message = message;
  }

  ngOnInit(): void {
    // fetching the state, city and interest in one request
    forkJoin([
      this.userservice.getStateCity(),
      this.userservice.getInterests(),
    ]).subscribe({
      next: (data) => {
        this.statecitylist = data[0];
        this.interestlist = data[1];

        // retrieving all the keys from the statecity means all states
        this.state = Object.keys(this.statecitylist);

        // adding all the formcontrols in the formarray
        this.interestlist.interests.forEach(() => {
          this.interestformarray.push(new FormControl<boolean | null>(false));
        });

        // when the edit id is got then subscribe
        this.activeroute.paramMap.subscribe((params) => {
          this.userid = Number(params.get('id'));

          if (this.userid) {
            this.userservice.getSingleUser(this.userid).subscribe({
              next: (value) => {
                window.scrollTo({ behavior: 'smooth', top: 0 });
                // resetting the interests when its selected again
                this.interestformarray.reset();

                this.reuserregisterform.patchValue({
                  FirstName: value.FirstName,
                  LastName: value.LastName,
                  Email: value.Email,
                  Password: value.Password,
                  DateOfBirth: dayjs(value.DateOfBirth).format('YYYY-MM-DD'),
                  Age: value.Age,
                  Address: value.Address,
                  ProfileImage: null,
                  City: value.City,
                  Gender: value.Gender,
                  IdofInterests: [],
                  PhoneNo: value.PhoneNo,
                  State: value.State,
                });
                // Assigning the profile image
                this.edituploadedimageurl = value.Profile;

                // assigning the city according to the state
                this.changeCityAccordingtoState(value.State);

                // assigning the checkbox to true
                this.convertToBooleanArray(value.ListofInterestId);
              },
              error: (err) => {
                this.setAlerts(true, 'User Does Not Exist', 'Warning');
                this.router.navigate(['user']);
              },
            });
          } else if (Number.isNaN(this.userid)) {
            this.router.navigate(['user']);
          }
        });
      },
      error: () => {
        this.setAlerts(
          true,
          'Failed to Load State, City and Interests',
          'Danger'
        );
      },
    });
  }

  // based on selected state change the cities
  changeCityAccordingtoState(selection: HTMLSelectElement | string): void {
    this.cities =
      this.statecitylist[
        selection instanceof HTMLSelectElement ? selection.value : selection
      ];
    if (selection instanceof HTMLSelectElement) {
      this.reuserregisterform.controls.City.reset('');
    }
  }

  // submit form
  submitForm(): void {
    this.checkAllInputsareValid();

    if (this.reuserregisterform.valid) {
      this.userid ? (this.loadertoshow = true) : null;
      const formdata = this.toFormData(this.reuserregisterform.value);

      const handleSuccess = (data: any) => {
        this.loadertoshow = false;
        window.scrollTo(0, 0);
        this.userservice.notifyreferesh.emit({
          isAlertBoxOpen: true,
          message: this.userid
            ? 'User Updated Successfully!'
            : 'User Registered Successfully',
          alerttype: 'Success',
        });
        if (this.userid) {
          this.router.navigate(['user']);
        } else {
          this.resetForm();
        }
      };

      const handleError = () => {
        this.loadertoshow = false;
        this.setAlerts(
          true,
          'Some Error Occurred While Registering the User',
          'Danger'
        );
      };

      const action$ = this.userid
        ? this.userservice.updateUser(formdata, this.userid)
        : this.userservice.addUser(formdata);

      action$.subscribe({
        next: handleSuccess,
        error: handleError,
      });
    }
  }

  // when the file is upload its blob is created and shown the uploaded image
  fileUpload(): void {
    this.isFileDialogClosed = false;
    let filetype = this.imageInput.nativeElement as HTMLInputElement;

    if (filetype.files?.length !== 0) {
      const supportedimagetypes: string[] = [
        'image/jpeg',
        'image/jpg',
        'image/png',
      ];
      if (supportedimagetypes.includes(filetype?.files[0]?.type)) {
        this.uploadedimageurl = URL.createObjectURL(filetype.files[0]);
        this.uploadedimage = filetype?.files[0];
        filetype.classList.remove('input-error');
      } else {
        filetype.classList.add('input-error');
        this.uploadedimage = null;
        this.uploadedimageurl = '';
        this.reuserregisterform.controls.ProfileImage.setErrors({
          wrongfileupload: true,
        });
      }
    } else if (
      this.uploadedimage &&
      this.reuserregisterform.controls.ProfileImage.hasError('required')
    ) {
      this.reuserregisterform.controls.ProfileImage.setErrors(null);
    }
  }

  // when the file dialog box is cancel then the error should be thrown
  fileUploadCancel(): void {
    let filetype = this.imageInput.nativeElement as HTMLInputElement;
    this.isFileDialogClosed = true;
    if (!this.uploadedimage && !this.edituploadedimageurl) {
      filetype.classList.add('input-error');
    }
  }

  // toggling the eye button of the password field
  toggleEye(passwordinput: HTMLInputElement): void {
    passwordinput.type =
      passwordinput.type === 'password' ? 'text' : 'password';
    document.getElementById('eye-icon').classList.toggle('glyphicon-eye-close');
  }

  // auto select the age when the user clicks on the dateof birth
  onDobChange(inputele: HTMLInputElement): void {
    this.reuserregisterform.controls.Age.patchValue(
      this.userservice.calculateAge(inputele.value)
    );
  }

  // Don't Allow the Character to be entered into the phone input field
  DontAllowCharacter(event: KeyboardEvent, inputele: HTMLInputElement): void {
    if (Number.isNaN(Number(event.key))) {
      event.preventDefault();
    }
  }

  // checks if all the input are valid or not
  checkAllInputsareValid(): void {
    if (this.reuserregisterform.invalid) {
      let controls: string[] = Object.keys(this.reuserregisterform.controls);
      controls.forEach((value) => {
        let currentcontrol: AbstractControl = this.reuserregisterform.controls[
          value
        ] as AbstractControl;
        if (currentcontrol.invalid) {
          if (value === 'ProfileImage' && !this.edituploadedimageurl) {
            this.imageInput.nativeElement.classList.add('input-error');
            this.isFileDialogClosed = true;
          } else if (value === 'ProfileImage' && this.edituploadedimageurl) {
            currentcontrol.setErrors(null);
          }

          currentcontrol.markAllAsTouched();
        }
      });
    }
  }

  // resets the form
  resetForm(): void {
    this.isFileDialogClosed = false;
    this.reuserregisterform.reset();
    this.removeUploadedImage();
    this.reuserregisterform.markAsUntouched();
    this.reuserregisterform.patchValue({
      Age: 0,
      Gender: 'Male',
      City: '',
      State: '',
    });
    this.imageInput.nativeElement.classList.remove('input-error');
  }

  // converts the data into formdata
  toFormData(user: any): FormData {
    const formdata = new FormData();
    let keys: string[] = Object.keys(user);
    keys.forEach((value) => {
      if (value === 'ProfileImage') {
        formdata.append(value, this.uploadedimage);
      } else if (value === 'IdofInterests') {
        formdata.append(value, this.convertToStringArray(user[value]));
      } else {
        formdata.append(value, user[value]);
      }
    });
    return formdata;
  }

  // converts the true value to id that should be submitted to the api
  convertToStringArray(IdofInterests: boolean[]): string {
    let interestsid: number[] = [];
    IdofInterests.map((value, index) => {
      if (value) {
        interestsid.push(this.interestlist.interests[index].InterestId);
      }
    });
    return `[${interestsid.toString()}]`;
  }

  // maps the id to the boolean value
  convertToBooleanArray(actualInterestId: number[]): void {
    let ptr: number = 0;
    this.interestlist.interests.forEach((value, index) => {
      if (value.InterestId === actualInterestId[ptr]) {
        this.interestformarray.at(index).patchValue(true);
        ptr++;
      }
    });
  }
}
