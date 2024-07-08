import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, OnInit, forwardRef, inject, input } from '@angular/core';
import {
  ControlValueAccessor,
  FormBuilder,
  FormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  Validator,
  Validators
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { IOtDevice } from '@neo-edge-web/models';

@Component({
  selector: 'ne-select-data-provider',
  standalone: true,
  imports: [CommonModule, MatButtonModule, ReactiveFormsModule, MatFormFieldModule, MatInput],
  templateUrl: './select-data-provider.component.html',
  styleUrl: './select-data-provider.component.scss',

  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectDataProviderComponent),
      multi: true
    },
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => SelectDataProviderComponent), multi: true }
  ],

  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectDataProviderComponent implements OnInit, AfterViewInit, ControlValueAccessor, Validator {
  otProfileList = input<IOtDevice<any>[]>([]);
  #fb = inject(FormBuilder);
  form: FormGroup;
  change: (value) => void;
  touch: (value) => void;

  writeValue(v) {
    console.log(v);
  }

  validate() {
    return this.form.invalid ? { formError: 'error' } : null;
  }

  registerOnChange(fn: any) {
    this.change = fn;
  }

  registerOnTouched(fn) {
    this.touch = fn;
  }

  onChange() {
    if (this.change) {
      this.change(this.form.value);
    }
  }

  ngOnInit() {
    this.form = this.#fb.group({
      otDevices: [[], [Validators.required]]
    });

    this.form.valueChanges.subscribe(() => {
      this.onChange();
    });
  }

  ngAfterViewInit() {
    this.onChange();
  }
}
