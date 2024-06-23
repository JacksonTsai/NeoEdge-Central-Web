import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, forwardRef, inject, input } from '@angular/core';
import {
  ControlValueAccessor,
  FormBuilder,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  UntypedFormControl,
  UntypedFormGroup,
  Validator
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { NeUploadPreviewImageComponent } from '@neo-edge-web/components';
import { OT_DEVICE_LOADING, SUPPORT_APPS_OT_DEVICE } from '@neo-edge-web/models';
import { ModbusRtuProfileComponent } from '../modbus-rtu-profile/modbus-rtu-profile.component';
import { ModbusTcpProfileComponent } from '../modbus-tcp-profile/modbus-tcp-profile.component';

@Component({
  selector: 'ne-ot-device-profile',
  standalone: true,
  imports: [
    CommonModule,
    ModbusRtuProfileComponent,
    ModbusTcpProfileComponent,
    MatCardModule,
    ReactiveFormsModule,
    NeUploadPreviewImageComponent
  ],
  templateUrl: './ot-device-profile.component.html',
  styleUrl: './ot-device-profile.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => OtDeviceProfileComponent),
      multi: true
    },
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => OtDeviceProfileComponent), multi: true }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OtDeviceProfileComponent implements OnInit, ControlValueAccessor, Validator {
  appName = input<SUPPORT_APPS_OT_DEVICE>();
  isEditMode = input(false);
  isLoading = input(OT_DEVICE_LOADING.NONE);
  otDeviceType = SUPPORT_APPS_OT_DEVICE;
  #fb = inject(FormBuilder);
  form: UntypedFormGroup;

  change: (value) => void;
  touch: (value) => void;
  validatorChange: (value) => void;

  get rtuProfileCtrl() {
    return this.form.get('rtuProfile') as UntypedFormControl;
  }

  get tcpProfileCtrl() {
    return this.form.get('tcpProfile') as UntypedFormControl;
  }

  get texolProfileCtrl() {
    return this.form.get('texolProfile') as UntypedFormControl;
  }

  get deviceIconCtrl() {
    return this.form.get('deviceIcon') as UntypedFormControl;
  }

  registerOnValidatorChange(fn) {
    this.validatorChange = fn;
  }

  writeValue(v) {
    if (OT_DEVICE_LOADING.NONE === this.isLoading()) {
      if (v?.iconPath) {
        this.deviceIconCtrl.setValue(v.iconPath);
      }
      if (SUPPORT_APPS_OT_DEVICE.MODBUS_RTU === this.appName()) {
        this.rtuProfileCtrl.setValue(v);
      } else if (SUPPORT_APPS_OT_DEVICE.MODBUS_TCP === this.appName()) {
        this.tcpProfileCtrl.setValue(v);
      } else {
        this.texolProfileCtrl.setValue(v);
      }
    }
  }

  validate() {
    if (SUPPORT_APPS_OT_DEVICE.MODBUS_RTU === this.appName()) {
      return this.rtuProfileCtrl.invalid ? { profile: 'error' } : null;
    } else if (SUPPORT_APPS_OT_DEVICE.MODBUS_TCP === this.appName()) {
      return this.tcpProfileCtrl.invalid ? { profile: 'error' } : null;
    } else {
      return this.texolProfileCtrl.invalid ? { profile: 'error' } : null;
    }
  }

  registerOnChange(fn: any) {
    this.change = fn;
  }

  registerOnTouched(fn) {
    this.touch = fn;
  }

  onChange() {
    if (!this.change) {
      return;
    }
    let profile = {};
    if (SUPPORT_APPS_OT_DEVICE.MODBUS_RTU === this.appName()) {
      profile = this.rtuProfileCtrl.value;
    } else if (SUPPORT_APPS_OT_DEVICE.MODBUS_TCP === this.appName()) {
      profile = this.tcpProfileCtrl.value;
    } else {
      profile = this.texolProfileCtrl.value;
    }

    this.change({
      deviceIcon: typeof this.deviceIconCtrl.value === 'object' ? this.deviceIconCtrl.value : null,
      profile
    });
  }

  ngOnInit() {
    this.form = this.#fb.group({
      deviceIcon: ['icon:default_ot_device'],
      rtuProfile: [''],
      tcpProfile: [''],
      texolProfile: ['']
    });

    this.form.valueChanges.subscribe((d) => {
      this.onChange();
    });
  }
}
