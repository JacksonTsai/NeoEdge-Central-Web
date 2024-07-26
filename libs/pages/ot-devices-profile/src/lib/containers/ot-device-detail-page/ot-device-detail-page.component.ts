import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { ReactiveFormsModule, UntypedFormControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterModule } from '@angular/router';
import { NeSupportAppItemComponent } from '@neo-edge-web/components';
import {
  IRtuProfileForUI,
  ITcpProfileForUI,
  OT_DEVICE_LOADING,
  PERMISSION,
  SUPPORT_APPS_OT_DEVICE,
  TEXOL_TAG_TYPE
} from '@neo-edge-web/models';
import { downloadCSV } from '@neo-edge-web/utils';
import { NgxPermissionsModule } from 'ngx-permissions';
import { OtDeviceProfileComponent, OtTagsComponent, SelectCommandTemplateComponent } from '../../components';
import { OtTexolTagComponent } from '../../components/ot-texol-tag/ot-texol-tag.component';
import { OtDeviceDetailStore } from '../../stores/ot-device-detail.store';
import {
  otTags,
  rtuProfile,
  setRTUInstance,
  setTCPInstance,
  tcpProfile,
  texolTags
} from '../../utils/ot-proflie.helper';

@Component({
  selector: 'ne-ot-device-detail-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
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
    MatDividerModule,
    NgxPermissionsModule
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
  permission = PERMISSION;

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
    this.deviceProfileCtrl.setValue(tcpProfile(this.otDevice()));
    this.otTagsCtrl.setValue({
      generateTagType: 'import-edit',
      tags: [...otTags(this.otDevice(), 'tcp')]
    });
  };

  setRtuProfile = () => {
    this.deviceProfileCtrl.setValue(rtuProfile(this.otDevice()));
    if (this.isRtuProfile) {
      this.otTagsCtrl.setValue({
        generateTagType: 'import-edit',
        tags: [...otTags(this.otDevice(), 'rtu')]
      });
    } else {
      const rtuDeviceProfile = this.otDevice().setting.Instances.RTU[0].Devices[0].Profile;
      if (rtuDeviceProfile?.Domains?.length > 0) {
        this.selectTexolTemplateCtrl.patchValue({
          texolMode: TEXOL_TAG_TYPE.General,
          tags: { ...texolTags(this.otDevice(), 'texol-general') }
        });
      } else {
        this.selectTexolTemplateCtrl.patchValue({
          texolMode: TEXOL_TAG_TYPE.Dedicated,
          tags: { ...texolTags(this.otDevice(), 'texol-dedicated') }
        });
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
        const otTags = this.otTagsCtrl.value;
        profile = {
          name: deviceProfile.profile.basic.deviceName,
          description: deviceProfile.profile?.basic?.description ?? '',
          setting: { ...setRTUInstance(deviceProfile.profile, otTags.tags) }
        };
      } else if (SUPPORT_APPS_OT_DEVICE.MODBUS_TCP === appName) {
        const otTags = this.otTagsCtrl.value;
        profile = {
          name: deviceProfile.profile.basic.deviceName,
          description: deviceProfile.profile?.basic?.description ?? '',
          setting: { ...setTCPInstance(deviceProfile.profile, otTags.tags) }
        };
      } else {
        if ('texol-dedicated' === this.selectTexolTemplateCtrl.value.generateTagType) {
          profile = {
            name: deviceProfile.profile.basic.deviceName,
            description: deviceProfile.profile?.basic?.description ?? '',
            setting: { ...setRTUInstance(deviceProfile.profile, this.selectTexolTemplateCtrl.value) }
          };
        } else {
          profile = {
            name: deviceProfile.profile.basic.deviceName,
            description: deviceProfile.profile?.basic?.description ?? '',
            setting: { ...setRTUInstance(deviceProfile.profile, this.selectTexolTemplateCtrl.value) }
          };
        }
      }
      this.#otDeviceDetailStore.editOtDevice({ profile, deviceIcon: deviceProfile.deviceIcon });
    }
  };
}
