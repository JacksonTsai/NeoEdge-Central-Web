import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, forwardRef, inject, OnInit, signal } from '@angular/core';
import {
  ControlValueAccessor,
  FormBuilder,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  UntypedFormControl,
  UntypedFormGroup,
  Validator,
  Validators
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { OtDevicesComponent } from '@neo-edge-web/ot-devices-profile';
import { bTypeValidator, whitespaceValidator } from '@neo-edge-web/validators';

@Component({
  selector: 'ne-message-setting',
  standalone: true,
  imports: [
    CommonModule,
    OtDevicesComponent,
    MatButtonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule
  ],
  templateUrl: './message-setting.component.html',
  styleUrl: './message-setting.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MessageSettingComponent),
      multi: true
    },
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => MessageSettingComponent), multi: true }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MessageSettingComponent implements OnInit, ControlValueAccessor, Validator {
  messageSettingForm: UntypedFormGroup;
  selectedOtDevice = signal([]);
  #fb = inject(FormBuilder);

  change: (value) => void;
  touch: (value) => void;

  writeValue = (v) => {
    console.log(v);
  };

  validate() {
    return this.messageSettingForm.invalid ? { formError: 'error' } : null;
  }

  registerOnChange = (fn) => {
    this.change = fn;
  };

  registerOnTouched = (fn) => {
    this.touch = fn;
  };

  onChange() {
    if (this.change) {
      this.change(this.messageSettingForm.value);
    }
  }

  get createDisabled() {
    return this.messageSettingForm.invalid || this.selectedOtDevice().length === 0;
  }

  get messageNameCtrl() {
    return this.messageSettingForm.get('messageName') as UntypedFormControl;
  }

  get messagePublishModeCtrl() {
    return this.messageSettingForm.get('messagePublishMode') as UntypedFormControl;
  }

  get publishIntervalCtrl() {
    return this.messageSettingForm.get('publishInterval') as UntypedFormControl;
  }

  get messageContainsCtrl() {
    return this.messageSettingForm.get('messageContains') as UntypedFormControl;
  }

  get messagePayloadSizeCtrl() {
    return this.messageSettingForm.get('messagePayloadSize') as UntypedFormControl;
  }

  ngOnInit() {
    this.messageSettingForm = this.#fb.group({
      messageName: ['', [Validators.required, bTypeValidator, whitespaceValidator]],
      messagePublishMode: ['', [Validators.required]],
      publishInterval: [15, [Validators.required, Validators.max(65536), Validators.min(1)]],
      messageContains: ['', [Validators.required]],
      messagePayloadSize: ['', [Validators.required, Validators.max(128), Validators.min(1)]]
    });

    this.messagePublishModeCtrl.valueChanges.subscribe((publishMode) => {
      if ('interval' === publishMode) {
        this.messageContainsCtrl.setValue('all');
      } else {
        this.messageContainsCtrl.setValue('latest');
      }
    });

    this.messageSettingForm.valueChanges.subscribe(() => {
      this.onChange();
    });
  }
}
