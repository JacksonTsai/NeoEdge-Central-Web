import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, UntypedFormControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { CREATE_OT_STEP, IRtuProfileForUI, ITcpProfileForUI, TSupportAppVersionData } from '@neo-edge-web/models';
import { downloadCSV } from '@neo-edge-web/utils';
import {
  OtDeviceProfileComponent,
  OtTagsComponent,
  SelectCommandTemplateComponent,
  SelectDeviceProtocolComponent
} from '../../components';
import { OtTexolTagComponent } from '../../components/ot-texol-tag/ot-texol-tag.component';
import { tagCsvContentTemplate } from '../../configs';
import { CreateOtDevicesStore } from '../../stores/create-ot-device.store';
import { setRTUInstance, setTCPInstance } from '../../utils/ot-proflie.helper';

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

  onCreateDevice = () => {
    const selectDeviceProtocol = this.selectDeviceProtocolCtrl.value as TSupportAppVersionData;
    const deviceProfile = this.deviceProfileCtrl.value as {
      deviceIcon: File;
      profile: IRtuProfileForUI & ITcpProfileForUI;
    };
    const otTags = this.otTagsCtrl.value;

    if (this.form.valid) {
      const { id: appVersionId } = selectDeviceProtocol.version;
      const { deviceName: name, description = '' } = deviceProfile.profile.basic;
      let setting = {};

      switch (this.selectDeviceProtocolCtrl.value.name) {
        case 'Modbus RTU':
          setting = { ...setRTUInstance(deviceProfile.profile, otTags.tags) };
          break;
        case 'TEXOL 213MM2-R1':
          setting = { ...setRTUInstance(deviceProfile.profile, otTags) };
          break;
        case 'Modbus TCP':
          setting = { ...setTCPInstance(deviceProfile.profile, otTags.tags) };
          break;
        default:
          return;
      }

      const profile = { appVersionId, name, description, setting };

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
