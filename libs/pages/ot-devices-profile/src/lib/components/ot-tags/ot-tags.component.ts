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
  AbstractControl,
  ControlValueAccessor,
  FormBuilder,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  UntypedFormArray,
  UntypedFormControl,
  UntypedFormGroup,
  Validator,
  Validators
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { IOtTag } from '@neo-edge-web/models';
import { whitespaceValidator } from '@neo-edge-web/validators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { tap } from 'rxjs';
import { tagOptions } from '../../configs';

@UntilDestroy()
@Component({
  selector: 'ne-ot-tags',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    MatOptionModule,
    ReactiveFormsModule
  ],
  templateUrl: './ot-tags.component.html',
  styleUrl: './ot-tags.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => OtTagsComponent),
      multi: true
    },
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => OtTagsComponent), multi: true }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OtTagsComponent implements OnInit, ControlValueAccessor, Validator {
  @Output() handleExportTags = new EventEmitter();
  #fb = inject(FormBuilder);
  isEditMode = input(false);
  form!: UntypedFormGroup;
  dataSource = new MatTableDataSource<any>([]);
  change: (value) => void;
  touch: (value) => void;
  protected tagOptions = tagOptions;
  displayedColumns: string[] = [
    'no',
    'tagName',
    'enable',
    'tagType',
    'function',
    'startAddress',
    'quantity',
    'trigger',
    'interval',
    'action'
  ];

  generateTagType = signal('');
  tags = signal(null);

  get tagsArray() {
    return this.form.get('tags') as UntypedFormArray;
  }

  constructor() {
    effect(() => {
      if (this.isEditMode()) {
        for (let i = 0; i < this.tagsArray.length; i++) {
          this.tagNameCtrl(i).enable();
          this.enableCtrl(i).enable();
          this.tagTypeCtrl(i).enable();
          this.functionCtrl(i).enable();
          this.startAddressCtrl(i).enable();
          this.quantityCtrl(i).enable();
          this.triggerCtrl(i).enable();
          this.intervalCtrl(i).enable();
        }
      } else {
        for (let i = 0; i < this.tagsArray.length; i++) {
          this.tagNameCtrl(i).disable();
          this.enableCtrl(i).disable();
          this.tagTypeCtrl(i).disable();
          this.functionCtrl(i).disable();
          this.startAddressCtrl(i).disable();
          this.quantityCtrl(i).disable();
          this.triggerCtrl(i).disable();
          this.intervalCtrl(i).disable();
        }
      }
    });
  }

  tagNameCtrl = (i: number) => {
    return this.tagsArray.at(i).get('tagName') as UntypedFormControl;
  };

  enableCtrl = (i: number) => {
    return this.tagsArray.at(i).get('enable') as UntypedFormControl;
  };

  tagTypeCtrl = (i: number) => {
    return this.tagsArray.at(i).get('tagType') as UntypedFormControl;
  };

  functionCtrl = (i: number) => {
    return this.tagsArray.at(i).get('function') as UntypedFormControl;
  };

  startAddressCtrl = (i: number) => {
    return this.tagsArray.at(i).get('startAddress') as UntypedFormControl;
  };

  quantityCtrl = (i: number) => {
    return this.tagsArray.at(i).get('quantity') as UntypedFormControl;
  };

  triggerCtrl = (i: number) => {
    return this.tagsArray.at(i).get('trigger') as UntypedFormControl;
  };

  intervalCtrl = (i: number) => {
    return this.tagsArray.at(i).get('interval') as UntypedFormControl;
  };

  writeValue(v) {
    if (!v) {
      return;
    }

    if (v.generateTagType === 'import-edit') {
      this.tagsArray.clear();
      this.dataSource.data = [];
    }

    if (Array.isArray(v.tags) && v.tags.length > 0) {
      v.tags.map((tag) => this.addTag(tag));
    }
  }

  validate(control: AbstractControl) {
    return this.tagsArray.invalid ? { formError: 'error' } : null;
  }

  registerOnChange(fn: any) {
    this.change = fn;
  }

  registerOnTouched(fn) {
    this.touch = fn;
  }

  onChange() {
    if (this.change) {
      this.change(this.tagsArray.getRawValue());
    }
  }

  functionEnable = (tagFunction, i: number) => {
    const tagType = this.tagTypeCtrl(i).value;
    return tagType.functionEnable.includes(tagFunction.value);
  };

  triggerEnable = (tagTrigger, i) => {
    const tagFunction = this.functionCtrl(i).value;
    return tagTrigger.depFunctionEnable.includes(tagFunction.value);
  };

  tagTypeChange = (i: number) => {
    const tagType = this.tagTypeCtrl(i)?.value;
    this.quantityCtrl(i).setValue(tagType?.quantity ?? '');
    if (tagType?.quantity) {
      this.quantityCtrl(i).disable();
    } else {
      this.quantityCtrl(i).enable();
    }
  };

  tagFunctionChange = (i: number) => {
    const tagFunction = this.functionCtrl(i)?.value;
    const triggerDataChangeIdx = this.tagOptions.tagTrigger.findIndex((d) => d.value === 'DataChange');
    const triggerCyclicIdx = this.tagOptions.tagTrigger.findIndex((d) => d.value === 'Cyclic');
    if (this.tagOptions.tagTrigger[triggerDataChangeIdx].depFunctionEnable.includes(tagFunction.value)) {
      this.triggerCtrl(i).setValue(this.tagOptions.tagTrigger[triggerDataChangeIdx]);
    } else {
      this.triggerCtrl(i).setValue(this.tagOptions.tagTrigger[triggerCyclicIdx]);
    }
    this.triggerChange(i);
  };

  triggerChange = (i: number) => {
    if (this.triggerCtrl(i).value.value === 'DataChange') {
      this.intervalCtrl(i).setValue('');
      this.intervalCtrl(i).disable();
    } else {
      this.intervalCtrl(i).setValue(1000);
      this.intervalCtrl(i).enable();
    }
  };

  addTag = (data?: IOtTag) => {
    this.tagsArray.push(
      new UntypedFormGroup({
        tagName: new UntypedFormControl({ value: data?.tagName ?? '', disabled: !this.isEditMode() }, [
          Validators.required,
          whitespaceValidator
        ]),
        enable: new UntypedFormControl({ value: data?.enable ?? true, disabled: !this.isEditMode() }),
        tagType: new UntypedFormControl({
          value: data?.dataType ?? tagOptions.tagTypeOpts[0],
          disabled: !this.isEditMode()
        }),
        function: new UntypedFormControl({
          value: data?.function ?? tagOptions.tagFunctionOpts[2],
          disabled: !this.isEditMode()
        }),
        startAddress: new UntypedFormControl({ value: data?.startAddress ?? 0, disabled: !this.isEditMode() }, [
          Validators.required,
          Validators.min(0),
          Validators.max(65535)
        ]),
        quantity: new UntypedFormControl({ value: data?.quantity ?? 1, disabled: !this.isEditMode() }, [
          Validators.required,
          Validators.min(0),
          Validators.max(65535)
        ]),
        trigger: new UntypedFormControl({
          value: data?.trigger ?? tagOptions.tagTrigger[0],
          disabled: !this.isEditMode()
        }),
        interval: new UntypedFormControl({ value: data?.interval ?? 1000, disabled: !this.isEditMode() }, [
          (Validators.required, Validators.min(100), Validators.max(86400000))
        ])
      })
    );
    this.dataSource.data = [
      ...this.dataSource.data,
      {
        tagName: '',
        enable: true,
        tagType: 'Boolean',
        function: tagOptions.tagFunctionOpts[0],
        startAddress: 0,
        quantity: 1,
        trigger: tagOptions.tagTrigger[0],
        interval: 1000
      }
    ];
  };

  onRemoveTag = (index: number) => {
    this.tagsArray.removeAt(index);
    this.dataSource.data = [...this.dataSource.data.filter((_, i) => i !== index)];
  };

  exportTags = () => {
    this.handleExportTags.emit(this.tagsArray.getRawValue());
  };

  ngOnInit() {
    this.form = this.#fb.group({
      tags: this.#fb.array([])
    });

    this.tagsArray.valueChanges
      .pipe(
        tap(() => {
          this.onChange();
        }),
        untilDestroyed(this)
      )
      .subscribe();
  }
}
