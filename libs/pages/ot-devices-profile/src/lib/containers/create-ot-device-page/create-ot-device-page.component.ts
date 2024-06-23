import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild, inject } from '@angular/core';
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
import { downloadCSV, swapType } from '@neo-edge-web/utils';
import {
  OtDeviceProfileComponent,
  OtTagsComponent,
  SelectCommandTemplateComponent,
  SelectDeviceProtocolComponent
} from '../../components';
import { OtTexolTagComponent } from '../../components/ot-texol-tag/ot-texol-tag.component';
import { tagCsvContentTemplate } from '../../configs';
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
    OtTagsComponent,
    OtTexolTagComponent
  ],
  templateUrl: './create-ot-device-page.component.html',
  styleUrl: './create-ot-device-page.component.scss',
  providers: [CreateOtDevicesStore],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateOtDevicePageComponent implements OnInit {
  #createOtDevicesStore = inject(CreateOtDevicesStore);
  #cd = inject(ChangeDetectorRef);
  #fb = inject(FormBuilder);
  @ViewChild('stepper') stepper: MatStepper;
  supportDevices = this.#createOtDevicesStore.supportDevices;
  texolTagDoc = this.#createOtDevicesStore.texolTagDoc;
  form: FormGroup;

  get nextBtnDisabled() {
    return this.getStepCtrl(CREATE_OT_STEP[this.currentStepperId]).invalid;
  }

  get createDisabled() {
    return this.form.invalid;
  }

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

  setRTUInstance = (
    otProfile: IRtuProfileForUI,
    otTags: IOtTagsForUI[] | { generateTagType: string; tags: any }
  ): IInstances<any> => {
    const rtuInstancesDevices = {
      Name: otProfile.basic.deviceName,
      SlaveID: otProfile.basic.slaveId
    };
    if (Array.isArray(otTags)) {
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
          Swap: swapType(otProfile.advanced.swapByte, otProfile.advanced.swapWord)
        }))
        .reduce((acc, value, index) => {
          acc[index] = value;
          return acc;
        }, {});
      rtuInstancesDevices['Commands'] = tags;
    } else {
      let profile = '';
      if (otTags.tags.level2 === otTags.tags.level3) {
        profile = `${otTags.tags.component}.${otTags.tags.level2}.Axial.${otTags.tags.axial}.profile`;
      } else {
        profile = `${otTags.tags.component}.${otTags.tags.level2}.${otTags.tags.level3}.Axial.${otTags.tags.axial}.profile`;
      }
      if ('texol-general' === otTags.generateTagType) {
        rtuInstancesDevices['Profile'] = {
          Name: 'General.profile',
          Domains: [...Object.keys(otTags.tags).filter((key) => otTags.tags[key])]
        };
      } else {
        rtuInstancesDevices['Profile'] = { Name: profile };
      }
    }

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
              0: { ...rtuInstancesDevices }
            }
          }
        }
      }
    };
  };

  setTCPInstance = (otProfile: ITcpProfileForUI, otTags: IOtTagsForUI[]): IInstances<any> => {
    const tags = otTags
      .map((d) => {
        return {
          Function: d.function.value,
          StartingAddress: d.startAddress,
          Quantity: d.quantity,
          Trigger: d.trigger.value,
          Interval: d.interval,
          Enable: d.enable,
          Name: d.tagName,
          DataType: d.tagType.value,
          Swap: swapType(otProfile.advanced.swapByte, otProfile.advanced.swapWord)
        };
      })
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

  onDownloadTagTemplateCsv = () => {
    downloadCSV(tagCsvContentTemplate, 'NeoEdgex_tags-_template');
  };

  onExportTags = (event) => {
    if (event.length > 0) {
      downloadCSV(
        event.map((d) => {
          return {
            tag_name: d.tagName,
            enable: d.enable,
            data_type: d.tagType.value,
            function: d.function.value,
            start_address: d.startAddress,
            quantity: d.quantity,
            trigger: d.trigger.value,
            interval: d.interval
          };
        }),
        `${this.deviceProfileCtrl.value.profile.basic.deviceName}_${this.selectDeviceProtocolCtrl.value.name}`
      );
    }
  };

  ngOnInit() {
    this.form = this.#fb.group({
      selectDeviceProtocol: [],
      deviceProfile: [],
      selectCommandTemplate: [],
      otTags: []
    });

    this.selectCommandTemplateCtrl.valueChanges.subscribe((d) => {
      this.otTagsCtrl.setValue(d);
      this.#cd.markForCheck();
    });

    this.selectDeviceProtocolCtrl.valueChanges.subscribe((d) => {
      if (d) {
        this.stepper.next();
      }
    });
  }
}
