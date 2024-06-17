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
  TItServiceAzureField
} from '@neo-edge-web/models';
import { whitespaceValidator } from '@neo-edge-web/validators';

@Component({
  selector: 'ne-it-service-azure',
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
  templateUrl: './it-service-azure.component.html',
  styleUrl: './it-service-azure.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ItServiceAzureComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => ItServiceAzureComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItServiceAzureComponent implements OnInit, ControlValueAccessor, Validator {
  mode = input<IT_SERVICE_DETAIL_MODE>(IT_SERVICE_DETAIL_MODE.CREATE);
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

  constructor() {
    effect(() => {
      this.changeEditMode(false);
      if (this.mode() === IT_SERVICE_DETAIL_MODE.CANCEL) {
        this.onCancelEdit();
      }
    });
  }

  setFormValue = (itServiceDetail: IItServiceField | null): void => {
    this.form.setValue({
      name: itServiceDetail?.name ?? '',
      host: itServiceDetail?.host ?? '',
      connection: itServiceDetail?.connection ?? this.appData()?.connectionData?.default?.value ?? ''
    });
  };

  changeEditMode = (isEdit: boolean): void => {
    if (this.mode() === IT_SERVICE_DETAIL_MODE.VEIW || this.mode() === IT_SERVICE_DETAIL_MODE.CANCEL) {
      this.nameCtrl.disable();
      this.hostCtrl.disable();
      this.connectionCtrl.disable();
    } else {
      this.nameCtrl.enable();
      this.hostCtrl.enable();
      this.connectionCtrl.enable();
    }
  };

  onCancelEdit = (): void => {
    this.changeEditMode(false);
    this.setFormValue(this.currentFieldData());
  };

  buildSetting = (fieldData: TItServiceAzureField): any => {
    return {
      Instances: {
        '0': {
          Name: fieldData?.name?.trim(),
          Process: {
            Parameters: {
              Host: fieldData?.host?.trim(),
              Protocol: fieldData.connection
            }
          }
        }
      }
    };
  };

  transformFieldDataToApi(fieldData: TItServiceAzureField): ICreateItServiceReq {
    const result = {
      appVersionId: this.appData()?.app?.id ?? 0,
      name: fieldData?.name?.trim(),
      setting: this.buildSetting(fieldData)
    };

    return result;
  }

  transformApiToFieldData(api: IItService) {
    const instance = api.setting.Instances['0'];
    const parameters = instance.Process.Parameters;

    return {
      name: instance.Name,
      host: parameters.Host,
      connection: parameters.Protocol
    };
  }

  ngOnInit(): void {
    this.form = this.#fb.group({
      name: [
        { value: '', disabled: true },
        [Validators.required, whitespaceValidator, this.validatorsService.bTypeValidator()]
      ],
      host: [{ value: '', disabled: true }, [Validators.required, whitespaceValidator]],
      connection: [{ value: null, disabled: true }, [Validators.required]]
    });

    this.setFormValue(this.currentFieldData() ?? null);

    this.form.valueChanges.subscribe((fieldData: TItServiceAzureField) => {
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
