import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  inject,
  input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, UntypedFormControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import {
  CREATE_OT_STEP,
  IRtuProfileForUI,
  ITcpProfileForUI,
  OT_DEVICE_PROFILE_MODE,
  TSupportAppVersionData
} from '@neo-edge-web/models';
import { downloadCSV } from '@neo-edge-web/utils';
import { tagCsvContentTemplate } from '../../configs';
import { setRTUInstance, setTCPInstance } from '../../utils';
import { OtDeviceProfileComponent } from '../ot-device-profile/ot-device-profile.component';
import { OtTagsComponent } from '../ot-tags/ot-tags.component';
import { OtTexolTagComponent } from '../ot-texol-tag/ot-texol-tag.component';
import { SelectCommandTemplateComponent } from '../select-command-template/select-command-template.component';
import { SelectDeviceProtocolComponent } from '../select-device-protocol/select-device-protocol.component';

@Component({
  selector: 'ne-create-ot-profile',
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
    OtTexolTagComponent,
    CreateOtProfileComponent
  ],
  templateUrl: './create-ot-profile.component.html',
  styleUrl: './create-ot-profile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateOtProfileComponent implements OnInit {
  @Output() handleCreateOtDevice = new EventEmitter();
  @Output() handleCreateAndSaveOtDevice = new EventEmitter();
  @Output() handleCloseDialog = new EventEmitter();

  otProfileMode = input<OT_DEVICE_PROFILE_MODE>(OT_DEVICE_PROFILE_MODE.OT_DEVICE_VIEW);
  supportDevices = input<any>([]);
  texolTagDoc = input<any>({});
  #cd = inject(ChangeDetectorRef);
  #fb = inject(FormBuilder);
  @ViewChild('stepper') stepper: MatStepper;
  form: FormGroup;
  otDeviceProfileMode = OT_DEVICE_PROFILE_MODE;

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

  onNextStep = () => {
    this.stepper.next();
  };

  onBackStep = () => {
    this.stepper.previous();
  };

  createDevice = () => {
    const selectDeviceProtocol = this.selectDeviceProtocolCtrl.value as TSupportAppVersionData;
    const deviceProfile = this.deviceProfileCtrl.value as {
      deviceIcon: File;
      profile: IRtuProfileForUI & ITcpProfileForUI;
    };
    const otTags = this.otTagsCtrl.value;

    const { id: appVersionId } = selectDeviceProtocol.version;
    const { deviceName: name, description = '' } = deviceProfile.profile.basic;
    let setting = {};

    switch (selectDeviceProtocol.name) {
      case 'Modbus RTU':
        setting = { ...setRTUInstance(deviceProfile.profile, otTags.tags) };
        break;
      case 'TEXOL 213MM2-R1':
        setting = { ...setRTUInstance(deviceProfile.profile, otTags) };
        break;
      case 'Modbus TCP':
        setting = { ...setTCPInstance(deviceProfile.profile, otTags.tags) };
        break;
    }
    return { profile: { appVersionId, name, description, setting }, deviceIcon: deviceProfile.deviceIcon };
  };

  onCreateDevice = () => {
    if (this.form.valid) {
      this.handleCreateOtDevice.emit(this.createDevice());
    }
  };

  onCreateAndSaveDevice = () => {
    if (this.form.valid) {
      this.handleCreateAndSaveOtDevice.emit(this.createDevice());
    }
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

  onCloseDialog = () => {
    this.handleCloseDialog.emit();
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
