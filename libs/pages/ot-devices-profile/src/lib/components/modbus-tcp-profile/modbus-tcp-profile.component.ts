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
import { ITcpProfileForUI, OT_DEVICE_PROFILE_MODE, SUPPORT_APPS_OT_DEVICE } from '@neo-edge-web/models';
import { pick } from '@neo-edge-web/utils';
import { bTypeValidator, ipValidator, positiveIntegerValidator, whitespaceValidator } from '@neo-edge-web/validators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { tap } from 'rxjs';

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
  otProfileMode = input<OT_DEVICE_PROFILE_MODE>(OT_DEVICE_PROFILE_MODE.OT_DEVICE_VIEW);
  isEditMode = input(false);
  #fb = inject(FormBuilder);
  form: UntypedFormGroup;
  otDeviceType = SUPPORT_APPS_OT_DEVICE.MODBUS_RTU;

  otDeviceProfileMode = OT_DEVICE_PROFILE_MODE;
  change: (value) => void;
  touch: (value) => void;

  constructor() {
    effect(() => {
      if (this.isEditMode()) {
        this.deviceNameCtrl.enable();
        this.slaveIdCtrl.enable();
        this.descriptionCtrl.enable();
        this.ipAddressCtrl.enable();
        this.portCtrl.enable();
        this.initialDelayCtrl.enable();
        this.delayBetweenPollsCtrl.enable();
        this.responseTimeoutCtrl.enable();
        this.pollingRetriesCtrl.enable();
        this.swapByteCtrl.enable();
        this.swapWordCtrl.enable();
      } else {
        this.deviceNameCtrl.disable();
        this.slaveIdCtrl.disable();
        this.descriptionCtrl.disable();
        this.ipAddressCtrl.disable();
        this.portCtrl.disable();
        this.initialDelayCtrl.disable();
        this.delayBetweenPollsCtrl.disable();
        this.responseTimeoutCtrl.disable();
        this.pollingRetriesCtrl.disable();
        this.swapByteCtrl.disable();
        this.swapWordCtrl.disable();
      }
    });
  }

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
    if (v) {
      this.deviceNameCtrl.setValue(v.basic.deviceName);
      this.slaveIdCtrl.setValue(v.basic.slaveId);
      this.descriptionCtrl.setValue(v.basic.description);
      this.ipAddressCtrl.setValue(v.basic.ip);
      this.portCtrl.setValue(v.basic.port);
      this.initialDelayCtrl.setValue(v.advanced.initialDelay);
      this.delayBetweenPollsCtrl.setValue(v.advanced.delayBetweenPolls);
      this.responseTimeoutCtrl.setValue(v.advanced.responseTimeout);
      this.pollingRetriesCtrl.setValue(v.advanced.pollingRetries);
      this.swapByteCtrl.setValue(v.advanced.swapByte);
      this.swapWordCtrl.setValue(v.advanced.swapWord);
    }
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
      deviceName: [{ value: '', disabled: false }, [Validators.required, whitespaceValidator, bTypeValidator]],
      slaveId: [{ value: 1, disabled: false }, [Validators.required, positiveIntegerValidator]],
      description: [{ value: '', disabled: false }],
      ipAddress: [{ value: '', disabled: false }, [Validators.required, ipValidator]],
      port: [{ value: 502, disabled: false }, [Validators.required]],

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
