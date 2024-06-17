import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, ViewChild, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, UntypedFormControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import {
  CREATE_OT_STEP,
  IInstances,
  IOtTagsForUI,
  IRtuProfileForUI,
  ITcpProfileForUI,
  TSupportAppVersionData
} from '@neo-edge-web/models';
import {
  OtDeviceProfileComponent,
  OtTagsComponent,
  SelectCommandTemplateComponent,
  SelectDeviceProtocolComponent
} from '../../components';
import { CreateOtDevicesStore } from '../../stores/create-ot-device.store';

@Component({
  selector: 'ne-create-ot-device-page',
  standalone: true,
  imports: [
    CommonModule,
    MatStepperModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    OtDeviceProfileComponent,
    SelectDeviceProtocolComponent,
    ReactiveFormsModule,
    SelectCommandTemplateComponent,
    OtTagsComponent
  ],
  templateUrl: './create-ot-device-page.component.html',
  styleUrl: './create-ot-device-page.component.scss',
  providers: [CreateOtDevicesStore],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateOtDevicePageComponent implements OnInit {
  #createOtDevicesStore = inject(CreateOtDevicesStore);
  @ViewChild('stepper') stepper: MatStepper;
  supportDevices = this.#createOtDevicesStore.supportDevices;

  #fb = inject(FormBuilder);
  form: FormGroup;

  get currentStepperId() {
    return this.stepper?.selectedIndex ?? 0;
  }

  get selectDeviceProtocolCtrl() {
    return this.form.get('selectDeviceProtocol') as UntypedFormControl;
  }

  get deviceProfileCtrl() {
    return this.form.get('deviceProfile') as UntypedFormControl;
  }

  get selectCommandTemplateCtrl() {
    return this.form.get('selectCommandTemplate') as UntypedFormControl;
  }

  get otTagsCtrl() {
    return this.form.get('otTags') as UntypedFormControl;
  }

  getStepCtrl = (ctrl) => {
    return this.form.get(ctrl) as UntypedFormControl;
  };

  swapType = (byte: boolean, word: boolean) => {
    if (byte && word) {
      return 'ByteWord';
    } else if (!byte && word) {
      return 'Word';
    } else if (byte && !word) {
      return 'Byte';
    } else {
      return 'None';
    }
  };

  setRTUInstance = (otProfile: IRtuProfileForUI, otTags: IOtTagsForUI[]): IInstances<any> => {
    const tags = otTags
      .map((d) => ({
        Function: d.function.value,
        StartingAddress: d.startAddress,
        Quantity: d.quantity,
        Trigger: d.trigger.value,
        Interval: d.interval,
        Enable: d.enable,
        Name: d.tagName,
        DataType: d.tagType.value,
        Swap: this.swapType(otProfile.advanced.swapByte, otProfile.advanced.swapWord)
      }))
      .reduce((acc, value, index) => {
        acc[index] = value;
        return acc;
      }, {});

    return {
      Instances: {
        RTU: {
          '0': {
            Properties: {
              BaudRate: otProfile.connectionSetting.baudRate,
              DataBit: otProfile.connectionSetting.dataBits,
              Parity: otProfile.connectionSetting.parity.value,
              StopBit: otProfile.connectionSetting.stopBit.toString(),
              InitialDelay: otProfile.advanced.initialDelay,
              DelayBetweenPolls: otProfile.advanced.delayBetweenPolls,
              ResponseTimeout: otProfile.advanced.responseTimeout,
              PollingRetries: otProfile.advanced.pollingRetries
            },
            Devices: {
              0: {
                Name: otProfile.basic.deviceName,
                SlaveID: otProfile.basic.slaveId,
                Commands: { ...tags }
              }
            }
          }
        }
      }
    };
  };

  setTCPInstance = (otProfile: ITcpProfileForUI, otTags: IOtTagsForUI[]): IInstances<any> => {
    const tags = otTags
      .map((d) => ({
        Function: d.function.value,
        StartingAddress: d.startAddress,
        Quantity: d.quantity,
        Trigger: d.trigger.value,
        Interval: d.interval,
        Enable: d.enable,
        Name: d.tagName,
        DataType: d.tagType.value,
        Swap: this.swapType(otProfile.advanced.swapByte, otProfile.advanced.swapWord)
      }))
      .reduce((acc, value, index) => {
        acc[index] = value;
        return acc;
      }, {});

    return {
      Instances: {
        TCP: {
          '0': {
            Properties: {
              IP: otProfile.basic.ipAddress,
              Port: otProfile.basic.port,
              InitialDelay: otProfile.advanced.initialDelay,
              DelayBetweenPolls: otProfile.advanced.delayBetweenPolls,
              ResponseTimeout: otProfile.advanced.responseTimeout,
              PollingRetries: otProfile.advanced.pollingRetries
            },
            Devices: {
              0: {
                Name: otProfile.basic.deviceName,
                SlaveID: otProfile.basic.slaveId,
                Commands: { ...tags }
              }
            }
          }
        }
      }
    };
  };

  onCreateDevice = () => {
    const selectDeviceProtocol = this.selectDeviceProtocolCtrl.value as TSupportAppVersionData;
    const deviceProfile = this.deviceProfileCtrl.value as {
      deviceIcon: File;
      profile: IRtuProfileForUI & ITcpProfileForUI;
    };

    const otTags = this.otTagsCtrl.value as IOtTagsForUI[];
    let profile = {};
    if (this.form.valid) {
      if (
        'TEXOL 213MM2-R1' === this.selectDeviceProtocolCtrl.value.name ||
        'Modbus RTU' === this.selectDeviceProtocolCtrl.value.name
      ) {
        profile = {
          appVersionId: selectDeviceProtocol.version.id,
          name: deviceProfile.profile.basic.deviceName,
          description: deviceProfile.profile?.basic?.description ?? '',
          setting: { ...this.setRTUInstance(deviceProfile.profile, otTags) }
        };
      } else if ('Modbus TCP' === this.selectDeviceProtocolCtrl.value.name) {
        profile = {
          appVersionId: selectDeviceProtocol.version.id,
          name: deviceProfile.profile.basic.deviceName,
          description: deviceProfile.profile?.basic?.description ?? '',
          setting: { ...this.setTCPInstance(deviceProfile.profile, otTags) }
        };
      }

      this.#createOtDevicesStore.createOtDevice({ profile, deviceIcon: deviceProfile.deviceIcon });
    }
  };

  onNextStep = () => {
    this.stepper.next();
  };

  onBackStep = () => {
    this.stepper.previous();
  };

  get nextBtnDisabled() {
    return this.getStepCtrl(CREATE_OT_STEP[this.currentStepperId]).invalid;
  }

  get createDisabled() {
    return this.form.invalid;
  }

  ngOnInit() {
    this.form = this.#fb.group({
      selectDeviceProtocol: [],
      deviceProfile: [],
      selectCommandTemplate: [],
      otTags: []
    });

    this.selectDeviceProtocolCtrl.valueChanges.subscribe((d) => {
      if (d) {
        this.stepper.next();
      }
    });
  }
}
