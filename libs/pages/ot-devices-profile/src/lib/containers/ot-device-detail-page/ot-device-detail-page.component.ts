import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { ReactiveFormsModule, UntypedFormControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTabsModule } from '@angular/material/tabs';
import { NeSupportAppItemComponent } from '@neo-edge-web/components';
import {
  IDevices,
  IInstances,
  IInstancesRtu,
  IInstancesTcp,
  IOtTagsForUI,
  IRtuProfileForUI,
  ITcpProfileForUI,
  OT_DEVICE_LOADING,
  SUPPORT_APPS_OT_DEVICE,
  TEXOL_TAG_TYPE
} from '@neo-edge-web/models';
import { downloadCSV, isSwapByte, isSwapWord, swapType } from '@neo-edge-web/utils';
import { OtDeviceProfileComponent, OtTagsComponent, SelectCommandTemplateComponent } from '../../components';
import { OtTexolTagComponent } from '../../components/ot-texol-tag/ot-texol-tag.component';
import { rtuOptions, tagOptions } from '../../configs';
import { OtDeviceDetailStore } from '../../stores/ot-device-detail.store';
@Component({
  selector: 'ne-ot-device-detail-page',
  standalone: true,
  imports: [
    CommonModule,
    OtDeviceProfileComponent,
    OtTagsComponent,
    NeSupportAppItemComponent,
    MatStepperModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    OtDeviceProfileComponent,
    OtTagsComponent,
    OtTexolTagComponent,
    OtDeviceProfileComponent,
    MatTabsModule,
    ReactiveFormsModule,
    SelectCommandTemplateComponent,
    MatDividerModule
  ],
  templateUrl: './ot-device-detail-page.component.html',
  styleUrl: './ot-device-detail-page.component.scss',
  providers: [OtDeviceDetailStore],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OtDeviceDetailPageComponent {
  #otDeviceDetailStore = inject(OtDeviceDetailStore);
  otDevice = this.#otDeviceDetailStore.otDevice;
  otDeviceVersion = this.#otDeviceDetailStore.otDeviceVersion;
  isLoading = this.#otDeviceDetailStore.isLoading;
  isEditMode = signal<boolean>(false);
  deviceProfileCtrl = new UntypedFormControl('');
  otTagsCtrl = new UntypedFormControl('');
  selectTexolTemplateCtrl = new UntypedFormControl('');
  texolTagDoc = this.#otDeviceDetailStore.texolTagDoc;

  constructor() {
    effect(
      () => {
        if (OT_DEVICE_LOADING.REFRESH === this.isLoading()) {
          this.#otDeviceDetailStore.getOtDeviceDetail();
          this.isEditMode.set(false);
        }
        if (this.otDevice() && this.isTcpProfile) {
          this.setTcpProfile();
        }
        if (this.otDevice() && (this.isRtuProfile || this.isTexolProfile)) {
          this.setRtuProfile();
        }
      },
      { allowSignalWrites: true }
    );
  }

  get isRtuProfile() {
    return SUPPORT_APPS_OT_DEVICE.MODBUS_RTU === this.otDeviceVersion()?.name;
  }

  get isTexolProfile() {
    return SUPPORT_APPS_OT_DEVICE.TEXOL213MM2R1 === this.otDeviceVersion()?.name;
  }

  get isTcpProfile() {
    return SUPPORT_APPS_OT_DEVICE.MODBUS_TCP === this.otDeviceVersion()?.name;
  }

  setTcpProfile = () => {
    const tcpInstance: IInstancesTcp = this.otDevice().setting.Instances;
    const tcpDevice: IDevices = this.otDevice().setting.Instances.TCP[0].Devices[0];
    const tcpDeviceCommands = tcpDevice?.Commands;
    const profileInfo = {
      slaveId: tcpDevice.SlaveID,
      deviceName: tcpDevice.Name,
      description: this.otDevice().description,
      ip: tcpInstance.TCP[0].Properties.IP,
      port: tcpInstance.TCP[0].Properties.Port,
      initialDelay: tcpInstance.TCP[0].Properties.InitialDelay,
      pollingRetries: tcpInstance.TCP[0].Properties.PollingRetries,
      responseTimeout: tcpInstance.TCP[0].Properties.ResponseTimeout,
      delayBetweenPolls: tcpInstance.TCP[0].Properties.DelayBetweenPolls,
      swapByte: isSwapByte(tcpDevice?.Commands[0].Swap) ?? false,
      swapWord: isSwapWord(tcpDevice?.Commands[0].Swap) ?? false,
      iconPath: this.otDevice().iconPath
    };
    this.deviceProfileCtrl.setValue(profileInfo);
    this.otTagsCtrl.setValue({
      generateTagType: 'import-edit',
      tags: [
        ...Object.values(tcpDeviceCommands).map((d) => ({
          tagName: d.Name,
          enable: d.Enable,
          trigger: tagOptions.tagTrigger.find((v) => v.value === d.Trigger),
          dataType: tagOptions.tagTypeOpts.find((v) => v.value === d.DataType),
          function: tagOptions.tagFunctionOpts.find((v) => v.value === d.Function),
          quantity: 1,
          startAddress: 0,
          interval: 1000
        }))
      ]
    });
  };

  setRtuProfile = () => {
    const rtuInstance: IInstancesRtu = this.otDevice().setting.Instances;
    const rtuDevice: IDevices = this.otDevice().setting.Instances.RTU[0].Devices[0];

    const profileInfo = {
      slaveId: rtuDevice.SlaveID,
      mode: rtuOptions.rtuModeOpts[0].value,
      baudRate: rtuInstance.RTU[0].Properties.BaudRate,
      dataBits: rtuInstance.RTU[0].Properties.DataBit,
      parity: rtuInstance.RTU[0].Properties.Parity,
      stopBit: rtuInstance.RTU[0].Properties.StopBit,
      deviceName: rtuDevice.Name,
      description: this.otDevice().description,
      initialDelay: rtuInstance.RTU[0].Properties.InitialDelay,
      pollingRetries: rtuInstance.RTU[0].Properties.PollingRetries,
      responseTimeout: rtuInstance.RTU[0].Properties.ResponseTimeout,
      delayBetweenPolls: rtuInstance.RTU[0].Properties.DelayBetweenPolls,
      swapByte: rtuDevice?.Commands && rtuDevice.Commands[0] ? isSwapByte(rtuDevice.Commands[0].Swap) : false,
      swapWord: rtuDevice?.Commands && rtuDevice.Commands[0] ? isSwapWord(rtuDevice?.Commands[0]?.Swap) : false,
      iconPath: this.otDevice().iconPath
    };
    this.deviceProfileCtrl.setValue(profileInfo);
    if (this.isRtuProfile) {
      const rtuDeviceCommands = rtuDevice?.Commands;
      this.otTagsCtrl.setValue({
        generateTagType: 'import-edit',
        tags: [
          ...Object.values(rtuDeviceCommands).map((d) => ({
            tagName: d.Name,
            enable: d.Enable,
            trigger: tagOptions.tagTrigger.find((v) => v.value === d.Trigger),
            dataType: tagOptions.tagTypeOpts.find((v) => v.value === d.DataType),
            function: tagOptions.tagFunctionOpts.find((v) => v.value === d.Function),
            quantity: 1,
            startAddress: 0,
            interval: 1000
          }))
        ]
      });
    } else {
      const rtuDeviceProfile = rtuDevice.Profile;

      if (rtuDeviceProfile?.Domains?.length > 0) {
        const otTexol = {
          generateTagType: 'texol-general',
          tags: {
            ...rtuDeviceProfile.Domains.reduce((acc, key) => {
              acc[key] = true;
              return acc;
            }, {})
          }
        };
        this.selectTexolTemplateCtrl.patchValue({
          texolMode: TEXOL_TAG_TYPE.General,
          tags: { ...otTexol.tags }
        });
      } else {
        let rtuDeviceProfileNameSplit = rtuDeviceProfile.Name.split('.');
        if (rtuDeviceProfileNameSplit.length !== 6) {
          rtuDeviceProfileNameSplit = [
            ...rtuDeviceProfileNameSplit.slice(0, 2),
            rtuDeviceProfileNameSplit[1],
            ...rtuDeviceProfileNameSplit.slice(2)
          ];
        }
        const otTexol = {
          generateTagType: 'texol-dedicated',
          tags: {
            component: rtuDeviceProfileNameSplit[0],
            level2: rtuDeviceProfileNameSplit[1],
            level3: rtuDeviceProfileNameSplit[2],
            axial: rtuDeviceProfileNameSplit[4]
          }
        };

        this.selectTexolTemplateCtrl.patchValue({
          texolMode: TEXOL_TAG_TYPE.Dedicated,
          tags: { ...otTexol.tags }
        });
        // this.texolTagType.set(otTexol);
      }
    }
  };

  onEdit = () => {
    this.isEditMode.set(true);
  };

  onCancel = () => {
    this.isEditMode.set(false);
    this.#otDeviceDetailStore.getOtDeviceDetail();
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
      if ('texol-general' === otTags.generateTagType) {
        rtuInstancesDevices['Profile'] = {
          Name: 'General.profile',
          Domains: [...Object.keys(otTags.tags).filter((key) => otTags.tags[key])]
        };
      } else {
        let profile = '';
        if (otTags.tags.level2 === otTags.tags.level3) {
          profile = `${otTags.tags.component}.${otTags.tags.level2}.Axial.${otTags.tags.axial}.profile`;
        } else {
          profile = `${otTags.tags.component}.${otTags.tags.level2}.${otTags.tags.level3}.Axial.${otTags.tags.axial}.profile`;
        }
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
        `${this.otDevice().name}_${this.otDevice().appClass}`
      );
    }
  };

  onSave = () => {
    const appName = this.otDeviceVersion().name;
    const deviceProfile = this.deviceProfileCtrl.value as {
      deviceIcon: File;
      profile: IRtuProfileForUI & ITcpProfileForUI;
    };

    let profile = {};

    if (this.deviceProfileCtrl.valid && this.otTagsCtrl.valid) {
      if (SUPPORT_APPS_OT_DEVICE.MODBUS_RTU === appName) {
        const otTags = this.otTagsCtrl.value as IOtTagsForUI[];
        profile = {
          name: deviceProfile.profile.basic.deviceName,
          description: deviceProfile.profile?.basic?.description ?? '',
          setting: { ...this.setRTUInstance(deviceProfile.profile, otTags) }
        };
      } else if (SUPPORT_APPS_OT_DEVICE.MODBUS_TCP === appName) {
        const otTags = this.otTagsCtrl.value as IOtTagsForUI[];
        profile = {
          name: deviceProfile.profile.basic.deviceName,
          description: deviceProfile.profile?.basic?.description ?? '',
          setting: { ...this.setTCPInstance(deviceProfile.profile, otTags) }
        };
      } else {
        if ('texol-dedicated' === this.selectTexolTemplateCtrl.value.generateTagType) {
          profile = {
            name: deviceProfile.profile.basic.deviceName,
            description: deviceProfile.profile?.basic?.description ?? '',
            setting: { ...this.setRTUInstance(deviceProfile.profile, this.selectTexolTemplateCtrl.value) }
          };
        } else {
          profile = {
            name: deviceProfile.profile.basic.deviceName,
            description: deviceProfile.profile?.basic?.description ?? '',
            setting: { ...this.setRTUInstance(deviceProfile.profile, this.selectTexolTemplateCtrl.value) }
          };
        }
      }

      this.#otDeviceDetailStore.editOtDevice({ profile, deviceIcon: deviceProfile.deviceIcon });
    }
  };
}
