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
  IItServiceDetail,
  IItServiceDetailSelectedAppData,
  IItServiceField,
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
  itServiceDetail = input<IItServiceDetail>();
  formService = inject(FormService);
  validatorsService = inject(ValidatorsService);
  itServiceDetailService = inject(ItServiceDetailService);
  #fb = inject(FormBuilder);
  form: FormGroup;

  onChange: any = () => {};
  onTouched: any = () => {};

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

  get keepAliveCtrl() {
    return this.form.get('keepAlive') as UntypedFormControl;
  }

  get qoSCtrl() {
    return this.form.get('qoS') as UntypedFormControl;
  }

  constructor() {
    effect(() => {
      this.changeEditMode(false);
    });
  }

  setFormValue = (): void => {
    this.form.setValue({
      name: this.currentFieldData()?.name ?? '',
      host: this.currentFieldData()?.host ?? '',
      connection: this.currentFieldData()?.connection ?? this.appData()?.connectionData?.default?.value ?? '',
      keepAlive: this.currentFieldData()?.keepAlive ?? 60,
      qoS: this.currentFieldData()?.qoS ?? 1
    });
  };

  changeEditMode = (isEdit: boolean): void => {
    if (this.mode() === IT_SERVICE_DETAIL_MODE.VEIW) {
      this.nameCtrl.disable();
      this.hostCtrl.disable();
      this.connectionCtrl.disable();
      this.keepAliveCtrl.disable();
      this.qoSCtrl.disable();
    } else {
      this.nameCtrl.enable();
      this.hostCtrl.enable();
      this.connectionCtrl.enable();
      this.keepAliveCtrl.enable();
      this.qoSCtrl.enable();
    }
  };

  buildSetting = (fieldData: TItServiceAwsField): any => {
    return {
      Instances: {
        '0': {
          Name: fieldData.name,
          Process: {
            Parameters: {
              QoS: fieldData.qoS,
              Host: `${IT_SERVICE_AWS_SCHEMA}://${fieldData.host}:${fieldData.connection}`,
              KeepAlive: fieldData.keepAlive,
              Credentials: {}
            }
          }
        }
      }
    };
  };

  transformFieldDataToApi(fieldData: TItServiceAwsField): ICreateItServiceReq {
    const result = {
      appVersionId: this.appData()?.app?.id ?? 0,
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
      qoS: parameters.QoS
    };
  }

  ngOnInit(): void {
    this.form = this.#fb.group({
      name: [{ value: '', disabled: true }, [Validators.required, this.validatorsService.bTypeValidator()]],
      host: [{ value: '', disabled: true }, [Validators.required]],
      connection: [{ value: null, disabled: true }, [Validators.required]],
      keepAlive: [{ value: 60, disabled: true }, [Validators.required, Validators.min(30), Validators.max(300)]],
      qoS: [{ value: 1, disabled: true }, [Validators.required]]
    });

    this.setFormValue();

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
    return this.form.valid ? null : { invalidForm: { valid: false, message: 'form fields are invalid' } };
  }
}
