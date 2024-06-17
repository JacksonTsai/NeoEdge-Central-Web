import { FormControl, ValidationErrors } from '@angular/forms';

export const positiveIntegerValidator = (control: FormControl): ValidationErrors | null => {
  const value = control.value;
  if (value === null || value === undefined || value === '') {
    return null;
  }
  const isValid = /^[1-9]\d*$/.test(value);
  return isValid ? null : { positiveInteger: true };
};
