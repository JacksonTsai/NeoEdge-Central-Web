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
  FormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  UntypedFormControl,
  Validator,
  Validators
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { IRtuProfileForUI, ISupportAppsWithVersion, SUPPORT_APPS_OT_DEVICE } from '@neo-edge-web/models';
import { pick } from '@neo-edge-web/utils';
import { positiveIntegerValidator, whitespaceValidator } from '@neo-edge-web/validators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { tap } from 'rxjs';
import { rtuOptions, texolOptions } from '../../configs';

@UntilDestroy()
@Component({
  selector: 'ne-modbus-rtu-profile',
  standalone: true,
  imports: [CommonModule, MatInputModule, ReactiveFormsModule, MatFormFieldModule, MatSelectModule],
  templateUrl: './modbus-rtu-profile.component.html',
  styleUrl: './modbus-rtu-profile.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ModbusRtuProfileComponent),
      multi: true
    },
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => ModbusRtuProfileComponent), multi: true }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModbusRtuProfileComponent implements OnInit, ControlValueAccessor, Validator, AfterViewInit {
  selectedDeviceProtocol = input<ISupportAppsWithVersion>();
  form: FormGroup;
  #fb = inject(FormBuilder);
  change: (value) => void;
  touch: (value) => void;

  otDeviceType = SUPPORT_APPS_OT_DEVICE.MODBUS_RTU;
  options = computed(() => {
    return SUPPORT_APPS_OT_DEVICE.TEXOL === this.selectedDeviceProtocol().name
      ? { ...texolOptions }
      : { ...rtuOptions };
  });

  get deviceNameCtrl() {
    return this.form.get('deviceName') as UntypedFormControl;
  }

  get slaveIdCtrl() {
    return this.form.get('slaveId') as UntypedFormControl;
  }

  get descriptionCtrl() {
    return this.form.get('description') as UntypedFormControl;
  }

  get modeCtrl() {
    return this.form.get('mode') as UntypedFormControl;
  }

  get baudRateCtrl() {
    return this.form.get('baudRate') as UntypedFormControl;
  }

  get dataBitsCtrl() {
    return this.form.get('dataBits') as UntypedFormControl;
  }

  get parityCtrl() {
    return this.form.get('parity') as UntypedFormControl;
  }

  get stopBitCtrl() {
    return this.form.get('stopBit') as UntypedFormControl;
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

  writeValue(profileData) {
    console.log(profileData);
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
      const rtuProfile: IRtuProfileForUI = {
        basic: pick(formData, 'deviceName', 'slaveId', 'description'),
        advanced: pick(
          formData,
          'initialDelay',
          'delayBetweenPolls',
          'responseTimeout',
          'pollingRetries',
          'swapByte',
          'swapWord'
        ),
        connectionSetting: pick(formData, 'mode', 'baudRate', 'dataBits', 'parity', 'stopBit')
      };
      this.change(rtuProfile);
    }
  }

  setTexolDefault = () => {
    this.form.patchValue({
      mode: this.options().rtuModeOpts[0],
      baudRate: this.options().rtuBaudRateOpts[0],
      dataBits: this.options().rtuDataBitsOpts[0],
      parity: this.options().rtuParityOpts[0],
      stopBit: this.options().rtuStopBitsOpts[0]
    });
    this.form.updateValueAndValidity();
  };

  ngOnInit() {
    this.form = this.#fb.group({
      deviceName: [{ value: '', disabled: false }, [Validators.required, whitespaceValidator]],
      slaveId: [{ value: 1, disabled: false }, [Validators.required, positiveIntegerValidator]],
      description: [{ value: '', disabled: false }],

      mode: [{ value: this.options().rtuModeOpts[0], disabled: false }, [Validators.required]],
      baudRate: [{ value: 19200, disabled: false }, [Validators.required]],
      dataBits: [{ value: 8, disabled: false }, [Validators.required]],
      parity: [{ value: this.options().rtuParityOpts[0], disabled: false }, [Validators.required]],
      stopBit: [{ value: 1, disabled: false }, [Validators.required]],

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

    if (SUPPORT_APPS_OT_DEVICE.TEXOL === this.selectedDeviceProtocol().name) {
      this.setTexolDefault();
    }

    this.form.valueChanges
      .pipe(
        tap(() => {
          this.onChange();
        }),
        untilDestroyed(this)
      )
      .subscribe();
  }

  ngAfterViewInit() {
    this.onChange();
  }
}
