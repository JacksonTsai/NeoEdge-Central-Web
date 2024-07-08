import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  OnInit,
  effect,
  forwardRef,
  inject,
  input
} from '@angular/core';
import {
  ControlValueAccessor,
  FormBuilder,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  UntypedFormControl,
  UntypedFormGroup,
  Validator,
  Validators
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { whitespaceValidator } from '@neo-edge-web/validators';
import { neoFlowProfileOptions } from '../../configs/neoflow-properties.config';

@Component({
  selector: 'ne-neoflow-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatInputModule, MatFormFieldModule, MatSelectModule],
  templateUrl: './neoflow-profile.component.html',
  styleUrl: './neoflow-profile.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NeoflowProfileComponent),
      multi: true
    },
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => NeoflowProfileComponent), multi: true }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NeoflowProfileComponent implements OnInit, ControlValueAccessor, Validator, AfterViewInit {
  processorVerOpt = input([]);
  #fb = inject(FormBuilder);
  form: UntypedFormGroup;
  change: (value) => void;
  touch: (value) => void;

  constructor() {
    effect(() => {
      this.neoFlowDataProcVerCtrl.setValue(this.processorVerOpt()[0]);
    });
  }

  protected neoFlowProfileOptions = neoFlowProfileOptions;

  get neoFlowNameCtrl() {
    return this.form.get('neoFlowName') as UntypedFormControl;
  }

  get encodeCtrl() {
    return this.form.get('encode') as UntypedFormControl;
  }

  get contentTypeCtrl() {
    return this.form.get('contentType') as UntypedFormControl;
  }

  get dateTimeFormatCtrl() {
    return this.form.get('dateTimeFor') as UntypedFormControl;
  }

  get timeZoneCtrl() {
    return this.form.get('timeZone(') as UntypedFormControl;
  }

  get neoFlowDataProcVerCtrl() {
    return this.form.get('neoFlowDataProcessorVer') as UntypedFormControl;
  }

  writeValue(v) {
    console.log(v);
  }

  validate() {
    return this.form.invalid ? { formError: 'error' } : null;
  }

  registerOnChange(fn) {
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

  seFormValue = () => {
    this.form.patchValue({
      encode: 'UTF-8',
      contentType: 'JSON',
      dateTimeFormat: 'ISO8601-2004',
      timeZone: 'UTC+0',
      neoFlowDataProcessorVer: this.processorVerOpt()[0]
    });
  };

  ngOnInit() {
    this.form = this.#fb.group({
      neoFlowName: ['', [Validators.required, whitespaceValidator]],
      encode: ['', [Validators.required]],
      contentType: ['', [Validators.required]],
      dateTimeFormat: ['', [Validators.required]],
      timeZone: ['', [Validators.required]],
      neoFlowDataProcessorVer: ['', [Validators.required]]
    });

    this.seFormValue();

    this.form.valueChanges.subscribe(() => {
      this.onChange();
    });
  }

  ngAfterViewInit() {
    this.onChange();
  }
}
