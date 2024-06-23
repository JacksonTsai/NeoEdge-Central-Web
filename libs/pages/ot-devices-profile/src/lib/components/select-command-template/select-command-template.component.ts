import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  OnInit,
  Output,
  effect,
  forwardRef,
  inject,
  input,
  signal
} from '@angular/core';
import {
  ControlValueAccessor,
  FormBuilder,
  FormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  UntypedFormControl,
  UntypedFormGroup,
  Validator,
  Validators
} from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NeUploadFileComponent } from '@neo-edge-web/components';
import { ICsvTag, IOtTag, SUPPORT_APPS_OT_DEVICE, TEXOL_TAG_TYPE } from '@neo-edge-web/models';
import { csvToObj } from '@neo-edge-web/utils';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { merge, tap } from 'rxjs';
import { tagOptions, texolFieldValidators } from '../../configs';

@UntilDestroy()
@Component({
  selector: 'ne-select-command-template',
  standalone: true,
  imports: [
    CommonModule,
    MatRadioModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatCheckboxModule,
    NeUploadFileComponent,
    MatIconModule,
    MatTooltipModule
  ],
  templateUrl: './select-command-template.component.html',
  styleUrl: './select-command-template.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectCommandTemplateComponent),
      multi: true
    },
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => SelectCommandTemplateComponent), multi: true }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectCommandTemplateComponent implements OnInit, ControlValueAccessor, Validator {
  @Output() handleDownloadTagTemplateCsv = new EventEmitter();
  appName = input<SUPPORT_APPS_OT_DEVICE>();
  texolTagDoc = input<any>({});
  isEditMode = input(false);
  #fb = inject(FormBuilder);
  texolTagType = TEXOL_TAG_TYPE;
  createTypeOpts = ['create', 'import'];
  supportAppsOtDevice = SUPPORT_APPS_OT_DEVICE;
  texolGeneralForm: UntypedFormGroup;
  texolDedicatedForm: UntypedFormGroup;
  createTypeCtrl = new UntypedFormControl('create');
  texolModeCtrl = new UntypedFormControl(TEXOL_TAG_TYPE.General);
  tagFileCtrl = new UntypedFormControl();
  importCsvResult = signal([]);
  csvContent = signal([]);

  constructor() {
    effect(() => {
      if (this.appName()) {
        this.onChange();
      }
    });

    effect(() => {
      const originTexolDedicatedForm = this.texolDedicatedForm.getRawValue();
      if (!this.isEditMode()) {
        this.texolModeCtrl.disable();
        this.texolGeneralForm.disable();
        this.texolDedicatedForm.disable();
      } else {
        this.texolModeCtrl.enable();
        this.texolGeneralForm.enable();
        this.texolDedicatedForm.enable();
      }

      if (!this.isTexolGeneral && originTexolDedicatedForm.component && originTexolDedicatedForm.axial) {
        this.texolDedicatedForm.setValue(originTexolDedicatedForm);
      }
    });
  }

  get isTexolGeneral() {
    return TEXOL_TAG_TYPE.General === this.texolModeCtrl.value;
  }

  get componentCtrl() {
    return this.texolDedicatedForm.get('component') as UntypedFormControl;
  }

  get level2Ctrl() {
    return this.texolDedicatedForm.get('level2') as UntypedFormControl;
  }

  get level3Ctrl() {
    return this.texolDedicatedForm.get('level3') as UntypedFormControl;
  }

  get axialCtrl() {
    return this.texolDedicatedForm.get('axial') as UntypedFormControl;
  }

  get texolCompLevelOpts() {
    if (this.texolTagDoc()) {
      return Object.keys(this.texolTagDoc()).filter((d) => TEXOL_TAG_TYPE.General !== d) ?? [];
    }
    return [];
  }

  get texolLevel2Opts() {
    if (this.texolTagDoc() && this.componentCtrl.getRawValue()) {
      return Object.keys(this.texolTagDoc()[this.componentCtrl.getRawValue()]) ?? [];
    }
    return [];
  }

  get texolLevel3Opts() {
    if (this.texolTagDoc() && this.componentCtrl.getRawValue() && this.level2Ctrl.getRawValue()) {
      return Object.keys(this.texolTagDoc()[this.componentCtrl.getRawValue()][this.level2Ctrl.getRawValue()]) ?? [];
    }
    return [];
  }

  get texolLevelAxialOpts() {
    if (this.texolTagDoc() && this.level2Ctrl.getRawValue() && this.level3Ctrl.getRawValue()) {
      return (
        Object.keys(
          this.texolTagDoc()[this.componentCtrl.getRawValue()][this.level2Ctrl.getRawValue()][
            this.level3Ctrl.getRawValue()
          ]
        ) ?? []
      );
    }
    return [];
  }

  change: (value) => void;
  touch: (value) => void;

  writeValue(v: {
    texolMode: TEXOL_TAG_TYPE;
    tags: {
      timeDomain: boolean;
      frequencyDomain: boolean;
      damageDomain: boolean;
    } & {
      component: string;
      level2: string;
      level3: string;
      axial: string;
    };
  }) {
    if (!v) {
      return;
    }
    if (TEXOL_TAG_TYPE.General === v.texolMode) {
      this.texolModeCtrl.setValue(TEXOL_TAG_TYPE.General);
      this.texolGeneralForm.patchValue({
        timeDomain: v.tags.timeDomain,
        frequencyDomain: v.tags.frequencyDomain,
        damageDomain: v.tags.damageDomain
      });
    } else {
      this.texolModeCtrl.setValue(TEXOL_TAG_TYPE.Dedicated);
      this.componentCtrl.setValue(this.texolCompLevelOpts.find((d) => d === v.tags.component));
      this.level2Ctrl.setValue(this.texolLevel2Opts.find((d) => d === v.tags.level2));
      this.level3Ctrl.setValue(this.texolLevel3Opts.find((d) => d === v.tags.level3));
      this.axialCtrl.setValue(this.texolLevelAxialOpts.find((d) => d === v.tags.axial));
    }
  }

  validate() {
    if (!this.appName()) {
      return null;
    }
    if (SUPPORT_APPS_OT_DEVICE.TEXOL213MM2R1 === this.appName()) {
      if (TEXOL_TAG_TYPE.General === this.texolModeCtrl.value) {
        return this.texolGeneralForm.invalid ? { formError: true } : null;
      } else {
        return this.texolDedicatedForm.invalid ? { formError: true } : null;
      }
    } else {
      if ('create' === this.createTypeCtrl.value) {
        return null;
      } else {
        return this.importCsvResult().length > 0 || this.csvContent().length === 0 ? { formError: true } : null;
      }
    }
  }

  registerOnChange(fn: any) {
    this.change = fn;
  }

  registerOnTouched(fn) {
    this.touch = fn;
  }

  onChange() {
    if (this.change) {
      if (SUPPORT_APPS_OT_DEVICE.TEXOL213MM2R1 === this.appName()) {
        if (TEXOL_TAG_TYPE.General === this.texolModeCtrl.value) {
          this.change({ generateTagType: 'texol-general', tags: this.texolGeneralForm.value });
        } else {
          this.change({ generateTagType: 'texol-dedicated', tags: this.texolDedicatedForm.value });
        }
      } else {
        if ('create' === this.createTypeCtrl.value) {
          this.change({ generateTagType: 'create', tags: {} });
        } else {
          this.change({
            generateTagType: 'import-edit',
            tags: [
              ...this.csvContent().map((d) => {
                const tag = d as ICsvTag;
                return {
                  tagName: tag.tag_name.trim(),
                  enable: tag.enable.toLowerCase() === 'false' ? false : true,
                  trigger: tagOptions.tagTrigger.find((v) => v.value === tag.trigger),
                  dataType: tagOptions.tagTypeOpts.find((v) => v.value === tag.data_type),
                  function: tagOptions.tagFunctionOpts.find((v) => v.value === Number(tag.function)),
                  quantity: Number(tag.quantity),
                  startAddress: Number(tag.start_address),
                  interval: Number(tag.interval)
                } as IOtTag;
              })
            ]
          });
        }
      }
    }
  }

  texolGeneralFormValidator = (fg: FormGroup) => {
    return Object.values(fg.value).some((d) => d) ? null : { texolGeneralFormInvalid: true };
  };

  checkTexolFieldValidators = (data: ICsvTag) => {
    try {
      return {
        tag_name: data.tag_name ? true : false,
        enable: texolFieldValidators.enable.test(data.enable),
        data_type: texolFieldValidators.data_type.test(data.data_type),
        function: texolFieldValidators.function.test(data.function),
        start_address: isNaN(Number(data.start_address)) ? false : true,
        quantity: isNaN(Number(data.quantity)) ? false : true,
        trigger: texolFieldValidators.trigger.test(data.trigger),
        interval: isNaN(Number(data.interval)) ? false : true
      };
    } catch {
      return { texolCsvError: 'Field is missing' };
    }
  };

  checkCsvFormat = (csvContent: ICsvTag[]) => {
    if (Object.keys(csvContent[0]).length !== 8) {
      this.importCsvResult.set(['Field is missing']);
      return this.importCsvResult();
    }

    csvContent.map((item, index) => {
      const checkResult = this.checkTexolFieldValidators(item);

      if (checkResult && Object.values(checkResult).findIndex((d) => !d) > -1) {
        this.importCsvResult.update((value) => {
          const errorItem = Object.keys(checkResult)
            .filter((key) => checkResult[key] === false)
            .join(', ');
          return [...value, `[Row ${index + 1}] invalid (${errorItem})`];
        });
      }
    });
    return this.importCsvResult();
  };

  downloadCsvTagTemplate = () => {
    this.handleDownloadTagTemplateCsv.emit();
  };

  ngOnInit() {
    this.tagFileCtrl.valueChanges.subscribe((d) => {
      if (d?.content) {
        this.importCsvResult.set([]);
        const csvContent = csvToObj(d.content);
        this.checkCsvFormat(csvContent);
        this.csvContent.set(csvContent);
        this.onChange();
      }
    });

    this.texolDedicatedForm = this.#fb.group({
      component: [{ value: '', disabled: false }, [Validators.required]],
      level2: [{ value: '', disabled: false }, [Validators.required]],
      level3: [{ value: '', disabled: false }, [Validators.required]],
      axial: [{ value: '', disabled: false }, [Validators.required]]
    });

    this.texolGeneralForm = this.#fb.group(
      {
        timeDomain: [{ value: false, disabled: false }],
        frequencyDomain: [{ value: false, disabled: false }],
        damageDomain: [{ value: false, disabled: false }]
      },
      {
        validator: this.texolGeneralFormValidator
      }
    );

    this.componentCtrl.valueChanges
      .pipe(
        untilDestroyed(this),
        tap(() => {
          this.level2Ctrl.setValue('');
          this.level3Ctrl.setValue('');
          this.axialCtrl.setValue('');
        })
      )
      .subscribe();

    this.level2Ctrl.valueChanges
      .pipe(
        untilDestroyed(this),
        tap(() => {
          this.level3Ctrl.setValue('');
          this.axialCtrl.setValue('');
        })
      )
      .subscribe();

    this.level3Ctrl.valueChanges
      .pipe(
        untilDestroyed(this),
        tap(() => {
          this.axialCtrl.setValue('');
        })
      )
      .subscribe();

    merge(
      this.createTypeCtrl.valueChanges,
      this.texolModeCtrl.valueChanges,
      this.texolDedicatedForm.valueChanges,
      this.texolGeneralForm.valueChanges
    )
      .pipe(
        untilDestroyed(this),
        tap(() => {
          this.onChange();
        })
      )
      .subscribe();
  }
}
