import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  forwardRef,
  inject,
  input
} from '@angular/core';
import {
  AbstractControl,
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
import { ISupportAppsWithVersion, ITcpProfileForUI, SUPPORT_APPS_OT_DEVICE } from '@neo-edge-web/models';
import { pick } from '@neo-edge-web/utils';
import { ipValidator, positiveIntegerValidator, whitespaceValidator } from '@neo-edge-web/validators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { tap } from 'rxjs';
import { rtuOptions, texolOptions } from '../../configs';

@UntilDestroy()
@Component({
  selector: 'ne-modbus-tcp-profile',
  standalone: true,
  imports: [CommonModule, MatInputModule, ReactiveFormsModule, MatFormFieldModule, MatSelectModule],
  templateUrl: './modbus-tcp-profile.component.html',
  styleUrl: './modbus-tcp-profile.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ModbusTcpProfileComponent),
      multi: true
    },
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => ModbusTcpProfileComponent), multi: true }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModbusTcpProfileComponent implements OnInit, AfterViewInit, ControlValueAccessor, Validator {
  selectedDeviceProtocol = input<ISupportAppsWithVersion>();
  #fb = inject(FormBuilder);
  form: UntypedFormGroup;

  otDeviceType = SUPPORT_APPS_OT_DEVICE.MODBUS_RTU;
  options = computed(() => {
    return SUPPORT_APPS_OT_DEVICE.TEXOL === this.selectedDeviceProtocol().name
      ? { ...texolOptions }
      : { ...rtuOptions };
  });
  change: (value) => void;
  touch: (value) => void;

  get deviceNameCtrl() {
    return this.form.get('deviceName') as UntypedFormControl;
  }

  get slaveIdCtrl() {
    return this.form.get('slaveId') as UntypedFormControl;
  }

  get ipAddressCtrl() {
    return this.form.get('ipAddress') as UntypedFormControl;
  }

  get portCtrl() {
    return this.form.get('port') as UntypedFormControl;
  }

  get descriptionCtrl() {
    return this.form.get('description') as UntypedFormControl;
  }

  get initialDelayCtrl() {
    return this.form.get('initialDelay') as UntypedFormControl;
  }

  get delayBetweenPollsCtrl() {
    return this.form.get('delayBetweenPolls') as UntypedFormControl;
  }

  get responseTimeoutCtrl() {
    return this.form.get('responseTimeout') as UntypedFormControl;
  }

  get pollingRetriesCtrl() {
    return this.form.get('pollingRetries') as UntypedFormControl;
  }

  get swapByteCtrl() {
    return this.form.get('swapByte') as UntypedFormControl;
  }

  get swapWordCtrl() {
    return this.form.get('swapWord') as UntypedFormControl;
  }

  writeValue(v) {
    console.log(v);
  }

  validate(control: AbstractControl) {
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
      const formData = this.form.value;
      const tcpProfile: ITcpProfileForUI = {
        basic: pick(formData, 'deviceName', 'slaveId', 'ipAddress', 'port', 'description'),
        advanced: pick(
          formData,
          'initialDelay',
          'delayBetweenPolls',
          'responseTimeout',
          'pollingRetries',
          'swapByte',
          'swapWord'
        )
      };
      this.change(tcpProfile);
    }
  }

  ngOnInit() {
    this.form = this.#fb.group({
      deviceName: [{ value: '', disabled: false }, [Validators.required, whitespaceValidator]],
      slaveId: [{ value: 1, disabled: false }, [Validators.required, positiveIntegerValidator]],
      description: [{ value: '', disabled: false }],
      ipAddress: [{ value: '', disabled: false }, [Validators.required, ipValidator]],
      port: [{ value: '', disabled: false }, [Validators.required]],

      initialDelay: [{ value: 0, disabled: false }, [Validators.required, Validators.min(0), Validators.max(30000)]],
      delayBetweenPolls: [
        { value: 20, disabled: false },
        [Validators.required, Validators.min(0), Validators.max(500)]
      ],
      responseTimeout: [
        { value: 1000, disabled: false },
        [Validators.required, Validators.min(10), Validators.max(120000)]
      ],
      pollingRetries: [{ value: 3, disabled: false }, [Validators.required, Validators.min(0), Validators.max(5)]],
      swapByte: [{ value: false, disabled: false }, [Validators.required]],
      swapWord: [{ value: false, disabled: false }, [Validators.required]]
    });

    this.form.valueChanges
      .pipe(
        tap(() => this.onChange()),
        untilDestroyed(this)
      )
      .subscribe();
  }

  ngAfterViewInit() {
    this.onChange();
  }
}
