import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { ReactiveFormsModule, UntypedFormControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTabsModule } from '@angular/material/tabs';
import { NeSupportAppItemComponent } from '@neo-edge-web/components';
import {
  IRtuProfileForUI,
  ITcpProfileForUI,
  OT_DEVICE_PROFILE_MODE,
  SUPPORT_APPS_OT_DEVICE,
  TEXOL_TAG_TYPE
} from '@neo-edge-web/models';
import {
  OtDeviceProfileComponent,
  otTags,
  OtTagsComponent,
  OtTexolTagComponent,
  rtuProfile,
  SelectCommandTemplateComponent,
  setRTUInstance,
  setTCPInstance,
  tcpProfile,
  texolTags
} from '@neo-edge-web/ot-devices-profile';
import { NgxPermissionsModule } from 'ngx-permissions';

@Component({
  selector: 'ne-ot-devcie-detail-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    MatTabsModule,
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
  templateUrl: './ot-device-detail-dialog.component.html',
  styleUrl: './ot-device-detail-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OtDeviceDetailDialogComponent implements OnInit {
  @Output() handleSave = new EventEmitter<any>();
  readonly dialogRef = inject(MatDialogRef<OtDeviceDetailDialogComponent>);
  data = inject<{ appName: string; otDevice: any; texolTagDoc: any }>(MAT_DIALOG_DATA);
  deviceProfileCtrl = new UntypedFormControl('');
  texolTemplateCtrl = new UntypedFormControl('');
  otTagsCtrl = new UntypedFormControl('');
  otDeviceProfileMode = OT_DEVICE_PROFILE_MODE;

  get isRtuProfile() {
    return SUPPORT_APPS_OT_DEVICE.MODBUS_RTU === this.data.appName;
  }

  get isTexolProfile() {
    return SUPPORT_APPS_OT_DEVICE.TEXOL213MM2R1 === this.data.appName;
  }

  get isTcpProfile() {
    return SUPPORT_APPS_OT_DEVICE.MODBUS_TCP === this.data.appName;
  }

  onSave = () => {
    const appName = this.data.appName;
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
        if ('texol-dedicated' === this.texolTemplateCtrl.value.generateTagType) {
          profile = {
            name: deviceProfile.profile.basic.deviceName,
            description: deviceProfile.profile?.basic?.description ?? '',
            setting: { ...setRTUInstance(deviceProfile.profile, this.texolTemplateCtrl.value) }
          };
        } else {
          profile = {
            name: deviceProfile.profile.basic.deviceName,
            description: deviceProfile.profile?.basic?.description ?? '',
            setting: { ...setRTUInstance(deviceProfile.profile, this.texolTemplateCtrl.value) }
          };
        }
      }
      console.log(profile);

      // this.#otDeviceDetailStore.editOtDevice({ profile, deviceIcon: deviceProfile.deviceIcon });
    }
  };

  setTcpProfile = () => {
    this.deviceProfileCtrl.setValue(tcpProfile(this.data.otDevice));
    this.otTagsCtrl.setValue({
      generateTagType: 'import-edit',
      tags: [...otTags(this.data.otDevice, 'tcp')]
    });
  };

  setRtuProfile = () => {
    this.deviceProfileCtrl.setValue(rtuProfile(this.data.otDevice));
    if (this.isRtuProfile) {
      this.otTagsCtrl.setValue({
        generateTagType: 'import-edit',
        tags: [...otTags(this.data.otDevice, 'rtu')]
      });
    } else {
      const rtuDeviceProfile = this.data.otDevice.setting.Instances.RTU[0].Devices[0].Profile;
      if (rtuDeviceProfile?.Domains?.length > 0) {
        this.texolTemplateCtrl.patchValue({
          texolMode: TEXOL_TAG_TYPE.General,
          tags: { ...texolTags(this.data.otDevice, 'texol-general') }
        });
      } else {
        this.texolTemplateCtrl.patchValue({
          texolMode: TEXOL_TAG_TYPE.Dedicated,
          tags: { ...texolTags(this.data.otDevice, 'texol-dedicated') }
        });
      }
    }
  };

  setProfile = {
    'Modbus TCP': () => this.setTcpProfile(),
    'Modbus RTU': () => this.setRtuProfile(),
    'TEXOL 213MM2-R1': () => this.setRtuProfile()
  };

  onClose = () => {
    this.dialogRef.close();
  };

  ngOnInit(): void {
    this.setProfile[this.data.appName]();
  }
}
