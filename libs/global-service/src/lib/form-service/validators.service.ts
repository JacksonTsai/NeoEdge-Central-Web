import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidatorsService {
  /**
   * Validator function to check if the control value matches the value of another control.
   *
   * @param {string} matchTo - The name of the form control to match the value with.
   * @returns {ValidatorFn} A validator function that returns an error map with the `isNotMatch` property
   *                        if the values do not match, otherwise null.
   */
  matchValidator(matchTo: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return !!control.parent && !!control.parent.value && control.value === control.parent.get(matchTo)?.value
        ? null
        : { isNotMatch: true };
    };
  }

  /**
   * Validator function to check if the control value matches the required password pattern.
   *
   * The password must contain at least one lowercase letter, one uppercase letter,
   * one digit, one special character, and be between 8 and 64 characters long.
   *
   * @returns {ValidatorFn} A validator function that returns an error map with the `invalidPassword` property
   *                        if the value does not match the pattern, otherwise null.
   */
  passwordValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;

      if (!value) {
        return null;
      }

      const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,64}$/;
      const isValid = passwordPattern.test(value);

      return isValid ? null : { invalidPassword: true };
    };
  }
}
