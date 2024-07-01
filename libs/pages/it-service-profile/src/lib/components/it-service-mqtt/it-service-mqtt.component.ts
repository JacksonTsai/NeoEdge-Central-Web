import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, computed, effect, forwardRef, inject, input } from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormBuilder,
  FormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  UntypedFormControl,
  ValidationErrors,
  Validator,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NeUploadFileComponent } from '@neo-edge-web/components';
import { FormService, ItServiceDetailService, ValidatorsService } from '@neo-edge-web/global-services';
import {
  ICreateItServiceReq,
  IItServiceDetail,
  IItServiceDetailSelectedAppData,
  IItServiceField,
  IItServiceSettingCredentials,
  IT_SERVICE_CA_TYPE,
  IT_SERVICE_DETAIL_LOADING,
  IT_SERVICE_DETAIL_MODE,
  TItServiceAwsField,
  TItServiceAzureProtocol
} from '@neo-edge-web/models';
import { fqdnValidator, whitespaceValidator } from '@neo-edge-web/validators';

@Component({
  selector: 'ne-it-service-mqtt',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatRadioModule,
    NeUploadFileComponent
  ],
  templateUrl: './it-service-mqtt.component.html',
  styleUrl: './it-service-mqtt.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ItServiceMqttComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => ItServiceMqttComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItServiceMqttComponent implements OnInit, ControlValueAccessor, Validator {
  title = input<string>('');
  mode = input<IT_SERVICE_DETAIL_MODE>(IT_SERVICE_DETAIL_MODE.CREATE);
  appData = input<IItServiceDetailSelectedAppData>();
  itServiceDetail = input<IItServiceDetail>();
  isLoading = input<IT_SERVICE_DETAIL_LOADING>();
  formService = inject(FormService);
  validatorsService = inject(ValidatorsService);
  itServiceDetailService = inject(ItServiceDetailService);
  #fb = inject(FormBuilder);
  form: FormGroup;
  caType = IT_SERVICE_CA_TYPE;

  onChange: any = () => {};
  onTouched: any = () => {};
  sortNull: any = () => {};

  currentFieldData = computed<IItServiceField | null>(() => {
    if (!this.itServiceDetail()) return null;
    return this.itServiceDetailService.apiToFieldData(this.itServiceDetail());
  });

  get nameCtrl() {
    return this.form.get('name') as UntypedFormControl;
  }

  get hostCtrl() {
    return this.form.get('host') as UntypedFormControl;
  }

  get connectionCtrl() {
    return this.form.get('connection') as UntypedFormControl;
  }

  get connectionCustomCtrl() {
    return this.form.get('connectionCustom') as UntypedFormControl;
  }

  get keepAliveCtrl() {
    return this.form.get('keepAlive') as UntypedFormControl;
  }

  get qoSCtrl() {
    return this.form.get('qoS') as UntypedFormControl;
  }

  get useTlsCtrl() {
    return this.form.get('useTls') as UntypedFormControl;
  }

  get useCertCtrl() {
    return this.form.get('useCert') as UntypedFormControl;
  }

  get useCaTypeCtrl() {
    return this.form.get('useCaType') as UntypedFormControl;
  }

  get fileCtrl() {
    return this.form.get('file') as UntypedFormControl;
  }

  constructor() {
    effect(
      () => {
        if (this.isLoading() === IT_SERVICE_DETAIL_LOADING.REFRESH) {
          this.setFormValue(this.currentFieldData());
        }

        this.changeEditMode(false);
        if (this.mode() === IT_SERVICE_DETAIL_MODE.CANCEL) {
          this.onCancelEdit();
        }
      },
      {
        allowSignalWrites: true
      }
    );
  }

  setFormValue = (itServiceDetail: IItServiceField | null): void => {
    const isCustom = itServiceDetail?.connection ? this.checkIsCustom(itServiceDetail?.connection) : false;
    this.form.setValue({
      name: itServiceDetail?.name ?? '',
      host: itServiceDetail?.host ?? '',
      connection: isCustom ? 0 : itServiceDetail?.connection ?? this.appData()?.connectionData?.default?.value ?? '',
      connectionCustom: isCustom ? itServiceDetail?.connection : '',
      keepAlive: itServiceDetail?.keepAlive ?? 60,
      qoS: itServiceDetail?.qoS ?? 1,
      useTls: !!itServiceDetail?.useTls,
      useCert: !!itServiceDetail?.useCert,
      useCaType: itServiceDetail?.useCaType ?? IT_SERVICE_CA_TYPE.Public,
      file: itServiceDetail?.file ?? null
    });
  };

  changeEditMode = (isEdit: boolean): void => {
    if (this.mode() === IT_SERVICE_DETAIL_MODE.VEIW || this.mode() === IT_SERVICE_DETAIL_MODE.CANCEL) {
      this.nameCtrl.disable();
      this.hostCtrl.disable();
      this.connectionCtrl.disable();
      this.connectionCustomCtrl.disable();
      this.keepAliveCtrl.disable();
      this.qoSCtrl.disable();
      this.useTlsCtrl.disable();
      this.useCertCtrl.disable();
      this.useCaTypeCtrl.disable();
      this.fileCtrl.disable();
    } else {
      this.nameCtrl.enable();
      this.hostCtrl.enable();
      this.connectionCtrl.enable();
      this.connectionCustomCtrl.enable();
      this.keepAliveCtrl.enable();
      this.qoSCtrl.enable();
      this.useTlsCtrl.enable();
      this.useCertCtrl.enable();
      this.useCaTypeCtrl.enable();
      this.fileCtrl.enable();
    }
  };

  onCancelEdit = (): void => {
    this.changeEditMode(true);
    this.setFormValue(this.currentFieldData());
  };

  buildSetting = (fieldData: TItServiceAwsField): any => {
    const SCHEMA = fieldData?.useTls ? 'tls' : 'tcp';
    const connection = this.checkIsCustom(fieldData?.connection) ? fieldData?.connectionCustom : fieldData?.connection;
    const Credentials: IItServiceSettingCredentials = {};

    if (fieldData?.useCert !== null) {
      Credentials.SkipCertVerify = !fieldData?.useCert;
      if (fieldData.useCaType === IT_SERVICE_CA_TYPE.Private && fieldData.file) {
        Credentials.CaCert = {
          Name: fieldData?.file.name,
          Content: fieldData?.file.content as string
        };
      }
    }

    return {
      Instances: {
        '0': {
          Name: fieldData?.name?.trim(),
          Process: {
            Parameters: {
              QoS: fieldData?.qoS,
              Host: `${SCHEMA}://${fieldData?.host?.trim()}:${connection}`,
              KeepAlive: fieldData?.keepAlive,
              Credentials: Credentials
            }
          }
        }
      }
    };
  };

  transformFieldDataToApi(fieldData: TItServiceAwsField): ICreateItServiceReq {
    const result = {
      appVersionId: this.appData()?.app?.id ?? 0,
      name: fieldData?.name?.trim(),
      setting: this.buildSetting(fieldData)
    };

    return result;
  }

  checkIsCustom(port: number | TItServiceAzureProtocol): boolean {
    if (port === null) return false;
    for (const connection of this.appData().connectionData.options) {
      if (connection.value !== 0 && connection.value === port) return false;
    }
    return true;
  }

  checkFileValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return control.value ? null : { fileRequire: true };
    };
  }

  ngOnInit(): void {
    this.form = this.#fb.group({
      name: [
        { value: '', disabled: true },
        [Validators.required, whitespaceValidator, this.validatorsService.bTypeValidator()]
      ],
      host: [{ value: '', disabled: true }, [Validators.required, whitespaceValidator, fqdnValidator]],
      connection: [{ value: null, disabled: true }, [Validators.required]],
      connectionCustom: [{ value: '', disabled: true }, []],
      keepAlive: [{ value: 60, disabled: true }, [Validators.required, Validators.min(30), Validators.max(300)]],
      qoS: [{ value: 1, disabled: true }, [Validators.required]],
      useTls: [{ value: false, disabled: true }, []],
      useCert: [{ value: false, disabled: true }, []],
      useCaType: [{ value: IT_SERVICE_CA_TYPE.Public, disabled: true }, []],
      file: [{ value: null, disabled: true }, []]
    });

    this.setFormValue(this.currentFieldData() ?? null);

    this.connectionCtrl?.valueChanges.subscribe((value) => {
      if (value === 0) {
        this.connectionCustomCtrl?.setValidators([Validators.required]);
      } else {
        this.connectionCustomCtrl?.clearValidators();
      }
      this.connectionCustomCtrl?.updateValueAndValidity();
    });

    this.useCaTypeCtrl?.valueChanges.subscribe((value) => {
      if (value === IT_SERVICE_CA_TYPE.Public) {
        this.fileCtrl?.clearValidators();
      } else {
        this.fileCtrl?.setValidators([Validators.required]);
      }
      this.fileCtrl?.updateValueAndValidity();
    });

    this.form.valueChanges.subscribe((fieldData: TItServiceAwsField) => {
      const value = this.transformFieldDataToApi(fieldData);
      this.onChange(value);
      this.onTouched();
    });
  }

  writeValue(value: any): void {
    if (value) {
      this.form.setValue(value);
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    isDisabled ? this.form.disable() : this.form.enable();
  }

  validate(control: AbstractControl): ValidationErrors | null {
    if (this.form.valid) {
      if (this.useCaTypeCtrl?.value === IT_SERVICE_CA_TYPE.Private) {
        return this.fileCtrl?.value ? null : { fileRequire: true };
      } else {
        return null;
      }
    } else {
      return { invalidForm: { valid: false, message: 'form fields are invalid' } };
    }
  }
}
