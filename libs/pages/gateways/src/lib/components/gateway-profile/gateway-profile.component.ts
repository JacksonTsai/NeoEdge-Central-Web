import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  OnInit,
  Output,
  ViewChild,
  computed,
  effect,
  inject,
  input,
  signal
} from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  UntypedFormArray,
  UntypedFormControl,
  UntypedFormGroup,
  Validators
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { NeMapComponent } from '@neo-edge-web/components';
import { SafePipe } from '@neo-edge-web/directives';
import {
  BOOLEAN_STATUS,
  GATEWAY_LOADING,
  IEditGatewayProfileReq,
  IGatewayCustomField,
  IGatewayLabels,
  IGetGatewaysDetailResp,
  IIpcSerialPort,
  PERMISSION,
  TMetaData
} from '@neo-edge-web/models';

import { img2Base64 } from '@neo-edge-web/utils';
import { whitespaceValidator } from '@neo-edge-web/validators';
import { LatLng } from 'leaflet';
import { NgxPermissionsModule } from 'ngx-permissions';
@Component({
  selector: 'ne-gateway-profile',
  standalone: true,
  imports: [
    NeMapComponent,
    CommonModule,
    MatCardModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    SafePipe,
    MatIconModule,
    NgxPermissionsModule,
    MatChipsModule
  ],
  templateUrl: './gateway-profile.component.html',
  styleUrl: './gateway-profile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GatewayProfileComponent implements OnInit {
  @Output() handleSaveProfile = new EventEmitter<{ gatewayProfile: IEditGatewayProfileReq; gatewayIcon?: File }>();
  @ViewChild('serialPortContent') serialPortContent: ElementRef;
  @ViewChild('customFieldContent') customFieldContent: ElementRef;
  gwDetail = input<IGetGatewaysDetailResp>();
  definedLabels = input<IGatewayLabels[]>();
  isLoading = input<GATEWAY_LOADING>(GATEWAY_LOADING.NONE);
  #fb = inject(FormBuilder);
  isEditMode = signal<boolean>(false);
  test = signal(0);
  logo = signal('');
  form!: UntypedFormGroup;
  permission = PERMISSION;
  booleanStatus = BOOLEAN_STATUS;
  readonly MAX_CUSTOMIZE_FIELD = 10;
  #cd = inject(ChangeDetectorRef);

  @HostListener('change', ['$event.target.files']) emitFiles(event: FileList) {
    if (!event) return;
    const file = event && event.item(0);
    img2Base64(file).subscribe((d) => {
      this.logo.set(`data:${file.type};base64,${d}`);
      this.gatewayIconPathCtrl.setValue(file);
      this.form.markAsDirty();
    });
  }

  constructor() {
    effect(
      () => {
        if (GATEWAY_LOADING.EDIT_METADATA !== this.isLoading() && GATEWAY_LOADING.GET_DETAIL !== this.isLoading()) {
          this.setFormValue(this.metaData());
        }
        if (GATEWAY_LOADING.GET_DETAIL === this.isLoading()) {
          this.changeEditMode(false);
        }
      },
      { allowSignalWrites: true }
    );
  }

  metaData = computed<TMetaData>(() => {
    const {
      name,
      longitude,
      latitude,
      ipcVendorName,
      ipcModelName,
      ipcSerialPorts,
      labels,
      customField,
      isPartnerIpc,
      ipcModelSeriesName,
      gatewayIconPath
    } = this.gwDetail();
    return {
      name,
      longitude,
      latitude,
      ipcVendorName,
      ipcModelName,
      ipcSerialPorts,
      labels,
      customField,
      isPartnerIpc,
      ipcModelSeriesName,
      gatewayIconPath
    };
  });

  get nameCtrl() {
    return this.form.get('name') as UntypedFormControl;
  }

  get longitudeCtrl() {
    return this.form.get('longitude') as UntypedFormControl;
  }

  get latitudeCtrl() {
    return this.form.get('latitude') as UntypedFormControl;
  }

  get ipcVendorNameCtrl() {
    return this.form.get('ipcVendorName') as UntypedFormControl;
  }

  get ipcModelNameCtrl() {
    return this.form.get('ipcModelName') as UntypedFormControl;
  }

  get gatewayIconPathCtrl() {
    return this.form.get('gatewayIconPath') as UntypedFormControl;
  }

  get ipcSerialPortsArr() {
    return this.form.get('ipcSerialPorts') as UntypedFormArray;
  }

  get labelsArr() {
    return this.form.get('labels') as UntypedFormArray;
  }

  get customFieldArr() {
    return this.form.get('customField') as UntypedFormArray;
  }

  get isSelectedLabelEmpty() {
    return this.labelsArr.value.findIndex((d) => d.selected) > -1 ? false : true;
  }

  partnerLogoPath = computed(() => {
    return `/assets/images/${this.metaData().ipcVendorName?.toLowerCase()}_logo.png`;
  });

  serialPortFg(index: number) {
    return this.ipcSerialPortsArr.at(index) as UntypedFormGroup;
  }

  serialPortNameCtrl = (index: number) => {
    return this.serialPortFg(index).get('name') as UntypedFormControl;
  };

  serialPortPathCtrl = (index: number) => {
    return this.serialPortFg(index).get('path') as UntypedFormControl;
  };

  removeSerialPort = (index: number) => {
    this.ipcSerialPortsArr.removeAt(index);
  };

  customFieldFg(index: number) {
    return this.customFieldArr.at(index) as UntypedFormGroup;
  }

  customFieldNameCtrl = (index: number) => {
    return this.customFieldFg(index).get('name') as UntypedFormControl;
  };

  customFieldValueCtrl = (index: number) => {
    return this.customFieldFg(index).get('value') as UntypedFormControl;
  };

  removeCustomField = (index: number) => {
    this.customFieldArr.removeAt(index);
  };

  setFormValue = (data: TMetaData) => {
    this.ipcSerialPortsArr.clear();
    this.customFieldArr.clear();
    this.labelsArr.clear();
    if (data.ipcSerialPorts?.length > 0) {
      data.ipcSerialPorts.map((d) => this.ipcSerialPortsArr.push(this.addSerialPortFormGroup(d)));
    }

    if (data.customField?.length > 0) {
      data.customField.map((d) => this.customFieldArr.push(this.addCustomFieldFormGroup(d)));
    }

    this.definedLabels().map((d) => {
      this.labelsArr.push(this.addGatewayLabelFormGroup(d, data.labels.findIndex((v) => v.id === d.id) > -1));
    });

    this.form.patchValue({
      name: data.name,
      longitude: data.longitude,
      latitude: data.latitude,
      ipcVendorName: data.ipcVendorName,
      ipcModelName: data.ipcModelName
    });
    this.setDeviceImagePath(data);
  };

  setDeviceImagePath = (data: TMetaData) => {
    const { ipcVendorName, ipcModelName, gatewayIconPath, isPartnerIpc } = data;

    if (gatewayIconPath) {
      this.logo.set(`${gatewayIconPath}`);
      return;
    }

    if (!ipcVendorName || !ipcModelName) {
      this.logo.set(`/assets/images/default_gateway.png`);
      return;
    }

    if (isPartnerIpc === BOOLEAN_STATUS.TRUE) {
      this.logo.set(`/assets/images/default_${ipcVendorName.toLowerCase()}_${ipcModelName}.png`);
    } else {
      this.logo.set('/assets/images/default_gateway.png');
    }
  };

  changeEditMode = (isEdit: boolean) => {
    this.isEditMode.set(isEdit);
    if (isEdit) {
      this.nameCtrl.enable();
      this.longitudeCtrl.enable();
      this.latitudeCtrl.enable();
      if (BOOLEAN_STATUS.FALSE === this.metaData().isPartnerIpc) {
        this.ipcVendorNameCtrl.enable();
        this.ipcModelNameCtrl.enable();
      }
      this.ipcSerialPortsArr.controls.map((fg) => {
        fg.get('name').enable();
        fg.get('path').enable();
      });
    } else {
      this.nameCtrl.disable();
      this.longitudeCtrl.disable();
      this.latitudeCtrl.disable();
      this.ipcVendorNameCtrl.disable();
      this.ipcModelNameCtrl.disable();

      this.ipcSerialPortsArr.controls.map((fg) => {
        fg.get('name').disable();
        fg.get('path').disable();
      });
    }
  };

  onCoordinate = (event: LatLng) => {
    this.latitudeCtrl.setValue(event.lat);
    this.longitudeCtrl.setValue(event.lng);
  };

  contentScrollToBottom = (element) => {
    element.nativeElement.scrollTop = element.nativeElement.scrollHeight - element.nativeElement.offsetHeight;
  };

  setNewSerialPort = () => {
    this.ipcSerialPortsArr.push(this.addSerialPortFormGroup());
    setTimeout(() => {
      this.contentScrollToBottom(this.serialPortContent);
    }, 0);
  };

  addSerialPortFormGroup = (data?: IIpcSerialPort) => {
    return new UntypedFormGroup({
      name: new UntypedFormControl({ value: data?.name ?? '', disabled: !this.isEditMode() }, [
        Validators.required,
        whitespaceValidator
      ]),
      path: new UntypedFormControl({ value: data?.path ?? '', disabled: !this.isEditMode() }, [
        Validators.required,
        whitespaceValidator
      ])
    });
  };

  setNewCustomField = () => {
    this.customFieldArr.push(this.addCustomFieldFormGroup());
    setTimeout(() => {
      this.contentScrollToBottom(this.customFieldContent);
    }, 0);
  };

  addCustomFieldFormGroup = (data?: IGatewayCustomField) => {
    return new UntypedFormGroup({
      name: new UntypedFormControl({ value: data?.name ?? '', disabled: !this.isEditMode() }, [
        Validators.required,
        whitespaceValidator
      ]),
      value: new UntypedFormControl({ value: data?.value ?? '', disabled: !this.isEditMode() }, [
        Validators.required,
        whitespaceValidator
      ])
    });
  };

  gwLabelFg = (index: number) => {
    return this.labelsArr.at(index) as UntypedFormGroup;
  };

  gwLabelSelectedCtrl = (index: number) => {
    return this.gwLabelFg(index).get('selected') as UntypedFormControl;
  };

  gwLabelColorCodeCtrl = (index: number) => {
    return this.gwLabelFg(index).get('colorCode') as UntypedFormControl;
  };

  gwLabelNameCtrl = (index: number) => {
    return this.gwLabelFg(index).get('name') as UntypedFormControl;
  };

  addGatewayLabelFormGroup = (data?: IGatewayLabels, selected = false) => {
    return new UntypedFormGroup({
      id: new UntypedFormControl(data?.id ?? ''),
      name: new UntypedFormControl(data?.name ?? ''),
      colorCode: new UntypedFormControl(data?.colorType ?? ''),
      selected: new UntypedFormControl(selected)
    });
  };

  selectLabel = (index: number, isSelected: boolean) => {
    this.gwLabelSelectedCtrl(index).setValue(isSelected);
  };

  onEdit = () => {
    this.changeEditMode(true);
  };

  onCancelEdit() {
    this.changeEditMode(false);
    this.setFormValue(this.metaData());
    this.form.markAsPristine();
  }

  onSave() {
    if (this.form.invalid || this.form.pristine || !this.form.dirty) {
      return;
    }
    const gatewayProfile: IEditGatewayProfileReq = {
      name: this.nameCtrl.value,
      ipcVendorName: this.ipcVendorNameCtrl.value,
      ipcModelName: this.ipcModelNameCtrl.value,
      longitude: this.longitudeCtrl.value,
      latitude: this.latitudeCtrl.value,
      selectedLabel: [...this.labelsArr.value.filter((d) => d.selected).map((v) => v.id)],
      customField: [...this.customFieldArr.value.map((d) => ({ name: d.name, value: d.value }))],
      serialPorts: [...this.ipcSerialPortsArr.value.map((d) => ({ name: d.name, path: d.path }))]
    };

    this.handleSaveProfile.emit({ gatewayProfile, gatewayIcon: this.gatewayIconPathCtrl.value });
  }

  ngOnInit() {
    this.form = this.#fb.group({
      name: [{ value: this.metaData().name, disabled: true }, [Validators.required, whitespaceValidator]],
      longitude: [{ value: this.metaData().longitude, disabled: true }, [Validators.required, whitespaceValidator]],
      latitude: [{ value: this.metaData().latitude, disabled: true }, [Validators.required, whitespaceValidator]],
      ipcVendorName: [{ value: this.metaData().ipcVendorName, disabled: true }, [Validators.required]],
      ipcModelName: [{ value: this.metaData().ipcModelName, disabled: true }, [Validators.required]],
      gatewayIconPath: [{ value: this.metaData().gatewayIconPath, disabled: true }, [Validators.required]],
      ipcSerialPorts: this.#fb.array(
        this.metaData().ipcSerialPorts?.length > 0
          ? [...this.metaData().ipcSerialPorts.map((d) => this.addSerialPortFormGroup(d))]
          : []
      ),
      labels: this.#fb.array([
        ...this.definedLabels().map((d) =>
          this.addGatewayLabelFormGroup(d, this.metaData().labels.findIndex((v) => v.id === d.id) > -1)
        )
      ]),
      customField: this.#fb.array(
        this.metaData().customField?.length > 0
          ? [...this.metaData().customField.map((d) => this.addCustomFieldFormGroup(d))]
          : []
      )
    });
    this.setDeviceImagePath(this.metaData());
    this.form.valueChanges.subscribe(() => this.form.markAsDirty());
  }
}
