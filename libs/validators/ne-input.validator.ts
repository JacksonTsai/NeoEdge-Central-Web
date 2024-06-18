import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

const upperLimit = (value, u = 255) => {
  return parseInt(value, 10) <= u;
};

const lowerLimit = (value, l = 0) => {
  return parseInt(value, 10) >= l;
};

export const ipValidator = (ctrl: FormControl): ValidationErrors | null => {
  if (ctrl.value) {
    const v = ctrl.value.split('.');
    if (v.length !== 4) {
      return { ipInvalid: true };
    }
    const isValid = v.every((value, index) =>
      index === 0 ? upperLimit(value) && lowerLimit(value) : upperLimit(value) && lowerLimit(value)
    );
    return !isValid ? { ipInvalid: true } : null;
  }

  return null;
};

export const positiveIntegerValidator = (control: FormControl): ValidationErrors | null => {
  const value = control.value;
  if (value === null || value === undefined || value === '') {
    return null;
  }
  const isValid = /^[1-9]\d*$/.test(value);
  return isValid ? null : { positiveInteger: true };
};

export const whitespaceValidator = (control: FormControl): ValidationErrors | null => {
  return (control.value || '').trim().length ? null : { whitespace: true };
};

/**
 * Validator function to check if the control value matches the value of another control.
 *
 * @param {string} matchTo - The name of the form control to match the value with.
 * @returns {ValidatorFn} A validator function that returns an error map with the `isNotMatch` property
 *                        if the values do not match, otherwise null.
 */
export const matchValidator = (matchTo: string): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    return !!control.parent && !!control.parent.value && control.value === control.parent.get(matchTo)?.value
      ? null
      : { isNotMatch: true };
  };
};

/**
 * Validator function that checks if the values of two form controls are equal.
 *
 * @param {string} selected - The name of the form control whose value will be compared.
 * @param {string} compare - The name of the form control to compare with.
 * @returns {ValidatorFn} A validation function that returns an error object with `{ isNotMatch: true }` if the values do not match, otherwise `null`.
 */
export const match2Field = (selected: string, compare: string) => {
  return (formGroup: FormGroup) => {
    const selectedControl = formGroup.controls[selected].value;
    const compareControl = formGroup.controls[compare].value;

    return selectedControl && compareControl && selectedControl !== compareControl ? { isNotMatch: true } : null;
  };
};

export const matchStr = (str: string): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    return control.value === str ? null : { isNotMatch: true };
  };
};

/**
 * Validator function to check if the control value matches the required password pattern.
 *
 * The password must contain at least one lowercase letter, one uppercase letter,
 * one digit, one special character, and be between 8 and 64 characters long.
 *
 * @returns {ValidatorFn} A validator function that returns an error map with the `invalidPassword` property
 *                        if the value does not match the pattern, otherwise null.
 */
export const passwordValidator = (): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (!value) {
      return null;
    }

    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,64}$/;
    const isValid = passwordPattern.test(value);

    return isValid ? null : { invalidPassword: true };
  };
};

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
export const minLengthValidator = (minLength: number): ValidatorFn => {
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
};

/**
 * Validator function to check if the value matches the B-Type pattern.
 *
 * The B-Type pattern allows alphanumeric characters (A-Z, a-z, 0-9), hyphens (-), and underscores (_).
 *
 * @returns {ValidatorFn} A validator function that returns an error map with the `format` property,
 *                        if the value does not match the pattern, otherwise null.
 */
export const bTypeValidator = (control: AbstractControl): ValidationErrors | null => {
  const pattern = /^[a-zA-Z0-9\-_]+$/;
  const value = control.value;
  if (!value || typeof value !== 'string') {
    return null;
  }
  return pattern.test(value) ? null : { format: true };
};

/**
 * Validator function to check if the value matches the Fully Qualified Domain Name (FQDN) format.
 *
 * This validator checks if the input string adheres to the FQDN format, which typically consists of alphanumeric characters and hyphens, separated by periods. The domain name must end with at least two letters (e.g., ".com").
 *
 * @returns {ValidatorFn} A validator function that returns an error map with the `format` property,
 *                        if the value does not match the pattern, otherwise null.
 */
export const fqdnValidator = (control: AbstractControl): ValidationErrors | null => {
  const pattern = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z]{2,})+$/;
  const value = control.value;

  if (!value || typeof value !== 'string') {
    return null;
  }
  return pattern.test(value) ? null : { format: true };
};
