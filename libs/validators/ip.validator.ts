import { FormControl } from '@angular/forms';

export const ipValidator = (ctrl: FormControl) => {
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

const upperLimit = (value, u = 255) => {
  return parseInt(value, 10) <= u;
};

const lowerLimit = (value, l = 0) => {
  return parseInt(value, 10) >= l;
};
