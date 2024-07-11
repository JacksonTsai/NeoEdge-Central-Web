import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  effect,
  forwardRef,
  inject,
  input
} from '@angular/core';
import {
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
import { IRtuProfileForUI, OT_DEVICE_PROFILE_MODE, SUPPORT_APPS_OT_DEVICE } from '@neo-edge-web/models';
import { pick } from '@neo-edge-web/utils';
import { bTypeValidator, positiveIntegerValidator, whitespaceValidator } from '@neo-edge-web/validators';
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
  otProfileMode = input<OT_DEVICE_PROFILE_MODE>(OT_DEVICE_PROFILE_MODE.OT_DEVICE_VIEW);
  appName = input<SUPPORT_APPS_OT_DEVICE>();
  isEditMode = input(false);
  form: FormGroup;
  #fb = inject(FormBuilder);
  change: (value) => void;
  touch: (value) => void;

  otDeviceProfileMode = OT_DEVICE_PROFILE_MODE;
  otDeviceType = SUPPORT_APPS_OT_DEVICE.MODBUS_RTU;
  options = computed(() => {
    return SUPPORT_APPS_OT_DEVICE.TEXOL213MM2R1 === this.appName() ? { ...texolOptions } : { ...rtuOptions };
  });

  constructor() {
    effect(() => {
      if (SUPPORT_APPS_OT_DEVICE.TEXOL213MM2R1 === this.appName()) {
        this.setTexolDefault();
      } else {
        this.setRtuDefault();
      }
    });

    effect(() => {
      if (this.isEditMode()) {
        this.deviceNameCtrl.enable();
        this.slaveIdCtrl.enable();
        this.descriptionCtrl.enable();
        this.initialDelayCtrl.enable();
        this.delayBetweenPollsCtrl.enable();
        this.responseTimeoutCtrl.enable();
        this.pollingRetriesCtrl.enable();
        this.swapByteCtrl.enable();
        this.swapWordCtrl.enable();
        this.modeCtrl.enable();
        this.baudRateCtrl.enable();
        this.dataBitsCtrl.enable();
        this.parityCtrl.enable();
        this.stopBitCtrl.enable();
      } else {
        this.deviceNameCtrl.disable();
        this.slaveIdCtrl.disable();
        this.descriptionCtrl.disable();
        this.initialDelayCtrl.disable();
        this.delayBetweenPollsCtrl.disable();
        this.responseTimeoutCtrl.disable();
        this.pollingRetriesCtrl.disable();
        this.swapByteCtrl.disable();
        this.swapWordCtrl.disable();
        this.modeCtrl.disable();
        this.baudRateCtrl.disable();
        this.dataBitsCtrl.disable();
        this.parityCtrl.disable();
        this.stopBitCtrl.disable();
      }
    });
  }

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

  writeValue(v) {
    if (v) {
      this.deviceNameCtrl.setValue(v.basic.deviceName);
      this.slaveIdCtrl.setValue(v.basic.slaveId);
      this.descriptionCtrl.setValue(v.basic.description);
      this.initialDelayCtrl.setValue(v.advanced.initialDelay);
      this.delayBetweenPollsCtrl.setValue(v.advanced.delayBetweenPolls);
      this.responseTimeoutCtrl.setValue(v.advanced.responseTimeout);
      this.pollingRetriesCtrl.setValue(v.advanced.pollingRetries);
      this.swapByteCtrl.setValue(v.advanced.swapByte);
      this.swapWordCtrl.setValue(v.advanced.swapWord);
      this.modeCtrl.setValue(this.options().rtuModeOpts.find((d) => d.value === v.connectionSetting.mode));
      this.baudRateCtrl.setValue(v.connectionSetting.baudRate);
      this.dataBitsCtrl.setValue(v.connectionSetting.dataBits);
      this.parityCtrl.setValue(this.options().rtuParityOpts.find((d) => d.value === v.connectionSetting.parity));
      this.stopBitCtrl.setValue(this.options().rtuStopBitsOpts.find((d) => d === v.connectionSetting.stopBit));
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
  };

  setRtuDefault = () => {
    this.form.patchValue({
      mode: this.options().rtuModeOpts[0],
      baudRate: 19200,
      dataBits: 8,
      parity: this.options().rtuParityOpts[0],
      stopBit: '1'
    });
  };

  ngOnInit() {
    this.form = this.#fb.group({
      deviceName: [{ value: '', disabled: false }, [Validators.required, whitespaceValidator, bTypeValidator]],
      slaveId: [{ value: 1, disabled: false }, [Validators.required, positiveIntegerValidator]],
      description: [{ value: '', disabled: false }],

      mode: [{ value: this.options().rtuModeOpts[0], disabled: false }, [Validators.required]],
      baudRate: [{ value: 19200, disabled: false }, [Validators.required]],
      dataBits: [{ value: 8, disabled: false }, [Validators.required]],
      parity: [{ value: this.options().rtuParityOpts[0], disabled: false }, [Validators.required]],
      stopBit: [{ value: '1', disabled: false }, [Validators.required]],

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

    if (SUPPORT_APPS_OT_DEVICE.TEXOL213MM2R1 === this.appName()) {
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
