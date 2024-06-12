import { Injectable } from '@angular/core';
import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

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
   * Validator function that checks if the values of two form controls are equal.
   *
   * @param {string} selected - The name of the form control whose value will be compared.
   * @param {string} compare - The name of the form control to compare with.
   * @returns {ValidatorFn} A validation function that returns an error object with `{ isNotMatch: true }` if the values do not match, otherwise `null`.
   */
  match2Field(selected: string, compare: string): ValidatorFn {
    return (formGroup: FormGroup) => {
      const selectedControl = formGroup.controls[selected].value;
      const compareControl = formGroup.controls[compare].value;

      return selectedControl && compareControl && selectedControl !== compareControl ? { isNotMatch: true } : null;
    };
  }

  matchStr(str: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return control.value === str ? null : { isNotMatch: true };
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

  /**
   * Validator function to check if the value meets the minimum length requirement.
   *
   * If the input type is a number, neither the minLength attribute nor Angular's Validator.minLength function works. Therefore, using this custom validator can resolve this issue.
   *
   * @param {number} minLength The minimum length value, requiring the input value to have a length greater than or equal to this value.
   * @returns {ValidatorFn} Returns a validation function that takes a control and returns a validation error or null.
   * If the length of the value is greater than or equal to the specified minimum length, it returns null; otherwise, it returns an object containing the invalidMinLength error.
   * If the type of the value is not a string or number, it returns an object containing the invalidType error.
   */
  minLengthValidator(minLength: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;

      if (!value) {
        return null;
      }

      let valueLength: number;

      if (typeof value === 'string') {
        valueLength = value.length;
      } else if (typeof value === 'number') {
        valueLength = value.toString().length;
      } else {
        return { invalidType: true };
      }

      return valueLength >= minLength ? null : { invalidMinLength: true };
    };
  }
}
