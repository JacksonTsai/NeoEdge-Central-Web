import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, forwardRef, inject, input } from '@angular/core';
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
  Validators
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormService, ItServiceDetailService, ValidatorsService } from '@neo-edge-web/global-services';
import {
  ICreateItServiceReq,
  IItService,
  IItServiceDetailSelectedAppData,
  IItServiceSettingCredentials,
  IT_SERVICE_DETAIL_MODE,
  TItServiceAwsField
} from '@neo-edge-web/models';

const IT_SERVICE_AWS_SCHEMA = 'tls';

@Component({
  selector: 'ne-it-service-aws',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ],
  templateUrl: './it-service-aws.component.html',
  styleUrl: './it-service-aws.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ItServiceAwsComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => ItServiceAwsComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItServiceAwsComponent implements OnInit, ControlValueAccessor, Validator {
  mode = input<IT_SERVICE_DETAIL_MODE>(IT_SERVICE_DETAIL_MODE.CREATE);
  projectId = input<number>(0);
  appData = input<IItServiceDetailSelectedAppData>();
  formService = inject(FormService);
  validatorsService = inject(ValidatorsService);
  itServiceDetailService = inject(ItServiceDetailService);
  #fb = inject(FormBuilder);
  form: FormGroup;

  onChange: any = () => {};
  onTouched: any = () => {};

  get nameCtrl() {
    return this.form.get('name') as UntypedFormControl;
  }

  get hostCtrl() {
    return this.form.get('host') as UntypedFormControl;
  }

  get connectionCtrl() {
    return this.form.get('connection') as UntypedFormControl;
  }

  get keepAliveCtrl() {
    return this.form.get('keepAlive') as UntypedFormControl;
  }

  get qoSCtrl() {
    return this.form.get('qoS') as UntypedFormControl;
  }

  get caCertFileCtrl() {
    return this.form.get('caCertFile') as UntypedFormControl;
  }

  setFormValue = (): void => {
    this.form.setValue({
      name: '',
      host: '',
      connection: this.appData()?.connectionData.default.value,
      keepAlive: 60,
      qoS: 1,
      caCertFileName: '',
      caCertFileContent: ''
    });
  };

  buildSetting = (fieldData: TItServiceAwsField): any => {
    let Credentials: IItServiceSettingCredentials | null = null;
    if (fieldData.caCertFileContent) {
      Credentials = {
        CaCert: {
          Name: fieldData.caCertFileName,
          Content: fieldData.caCertFileContent
        }
      } as IItServiceSettingCredentials;
    }

    return {
      Instances: {
        '0': {
          Name: fieldData.name,
          Process: {
            Parameters: {
              QoS: fieldData.qoS,
              Host: `${IT_SERVICE_AWS_SCHEMA}://${fieldData.host}:${fieldData.connection}`,
              KeepAlive: fieldData.keepAlive,
              Credentials: Credentials ?? {}
            }
          }
        }
      }
    };
  };

  transformFieldDataToApi(fieldData: TItServiceAwsField): ICreateItServiceReq {
    const result = {
      appVersionId: this.appData().app.id,
      name: fieldData.name,
      projectId: this.projectId(),
      setting: this.buildSetting(fieldData)
    };

    return result;
  }

  transformApiToFieldData(api: IItService) {
    const instance = api.setting.Instances['0'];
    const parameters = instance.Process.Parameters;
    const hostParts = parameters.Host.replace('tls://', '').split(':');

    return {
      name: instance.Name,
      host: hostParts[0],
      connection: parseInt(hostParts[1], 10),
      keepAlive: parameters.KeepAlive,
      qoS: parameters.QoS,
      caCertFileName: parameters.Credentials.CaCert.Name,
      caCertFileContent: parameters.Credentials.CaCert.Content
    };
  }

  ngOnInit(): void {
    this.form = this.#fb.group({
      name: ['', [Validators.required, this.validatorsService.bTypeValidator()]],
      host: ['', [Validators.required, this.validatorsService.fqdnValidator()]],
      connection: [null, [Validators.required]],
      keepAlive: [60, [Validators.required, Validators.min(30), Validators.max(300)]],
      qoS: [1, [Validators.required]],
      caCertFileName: [''],
      caCertFileContent: ['']
    });

    this.setFormValue();

    this.form.valueChanges.subscribe((fieldData: TItServiceAwsField) => {
      const value = this.transformFieldDataToApi(fieldData);
      this.onChange(value);
      this.onTouched();
    });
  }

  writeValue(value: any): void {
    console.log('writeValue', value);
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
    return this.form.valid ? null : { invalidForm: { valid: false, message: 'form fields are invalid' } };
  }
}
