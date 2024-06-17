import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, forwardRef, inject, input } from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormBuilder,
  FormControl,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  UntypedFormGroup,
  Validator,
  Validators
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { ISupportAppsWithVersion } from '@neo-edge-web/models';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { tap } from 'rxjs';

@UntilDestroy()
@Component({
  selector: 'ne-select-command-template',
  standalone: true,
  imports: [CommonModule, MatRadioModule, MatFormFieldModule, ReactiveFormsModule],
  templateUrl: './select-command-template.component.html',
  styleUrl: './select-command-template.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectCommandTemplateComponent),
      multi: true
    },
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => SelectCommandTemplateComponent), multi: true }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectCommandTemplateComponent implements OnInit, ControlValueAccessor, Validator {
  selectedDeviceProtocol = input<ISupportAppsWithVersion>();
  #fb = inject(FormBuilder);
  form: UntypedFormGroup;
  createTypeCtrl = new FormControl('create');
  csvContent = new FormControl('create', [Validators.required]);
  createTypeOpts = ['create', 'import'];

  change: (value) => void;
  touch: (value) => void;

  writeValue(v) {
    console.log(v);
  }

  validate(control: AbstractControl) {
    if ('import' === this.createTypeCtrl.value) {
      return this.form.invalid ? { formError: 'error' } : null;
    }
    return null;
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
      name: ['', [Validators.required]]
    });

    this.form.valueChanges
      .pipe(
        tap(() => this.onChange()),
        untilDestroyed(this)
      )
      .subscribe();
  }
}
