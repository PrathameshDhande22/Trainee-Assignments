import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { UserService } from '../Services/user.service';
import { inject } from '@angular/core';

export class UserFormValidator {
  // Validator which checks if the selected date is not the future date.
  static pastDate(control: AbstractControl): ValidationErrors | null {
    const date = new Date(control.value);
    const today = new Date();

    // clearing the time
    today.setHours(0, 0, 0, 0);

    if (date > today) {
      return { futureDate: 'Birthdate cannot be in the future' };
    }
    return null;
  }

  // Checks the age by passing the dateofbirth.
  static checkAge(): ValidatorFn {
    // injecting the user service
    const userserivce: UserService = inject(UserService);
    return function (control: AbstractControl): ValidationErrors | null {
      const dateofbirth = control.parent?.get('DateOfBirth')?.value;
      if (dateofbirth) {
        const calculatedage = userserivce.calculateAge(dateofbirth);

        if (calculatedage !== control.value || calculatedage < 1 || !dateofbirth) {
          return { WrongAge: true };
        }
      }
      return null;
    };
  }

  // ensures that at most passed number to be checked
  static oneSelected(count: number): ValidatorFn {
    return function (
      control: AbstractControl<boolean[]>
    ): ValidationErrors | null {
      let truevaluescount: number = control.value.filter((value) => {
        return value ? value : null;
      }).length;
      if (truevaluescount < count) {
        return { OneSelected: true };
      }
      return null;
    };
  }
}
