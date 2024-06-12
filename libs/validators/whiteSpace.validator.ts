import { FormControl } from '@angular/forms';

export const whitespaceValidator = (control: FormControl) => {
  return (control.value || '').trim().length ? null : { whitespace: true };
};
