import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatFormField, MatInputModule } from '@angular/material/input';
import { FormService, ValidatorsService } from '@neo-edge-web/global-services';
import { AUTHENTICATION_CODE_LOADING, IGetUserProfileResp } from '@neo-edge-web/models';

@Component({
  selector: 'ne-authentication-code',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatFormField,
    MatDividerModule,
    MatIconModule
  ],
  templateUrl: './authentication-code.component.html',
  styleUrl: './authentication-code.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthenticationCodeComponent implements OnInit {
  @Output() handleValidMfaCode: EventEmitter<IGetUserProfileResp> = new EventEmitter<IGetUserProfileResp>();
  data = inject<{ userInfo: IGetUserProfileResp }>(MAT_DIALOG_DATA);
  #fb = inject(FormBuilder);
  formService = inject(FormService);
  validatorsService = inject(ValidatorsService);
  form: UntypedFormGroup;
  isLoading = signal<AUTHENTICATION_CODE_LOADING>(AUTHENTICATION_CODE_LOADING.NONE);

  get codeCtrl() {
    return this.form.get('code') as UntypedFormControl;
  }

  constructor(public dialogRef: MatDialogRef<AuthenticationCodeComponent>) {}

  onInputChange(value: string) {
    if (value.length >= 6) {
      this.onSubmit();
    }
  }

  submitMfa = () => {
    // TODO 串接送出 MFA Code API
    this.isLoading.set(AUTHENTICATION_CODE_LOADING.SEND_CODE);

    // 失敗後執行
    // this.isLoading.set(AUTHENTICATION_CODE_LOADING.NONE);

    // 成功後執行
    this.handleValidMfaCode.emit(this.data?.userInfo);
  };

  onSubmit = () => {
    if (this.form.invalid) {
      return;
    }
    this.submitMfa();
    this.codeCtrl.disable();
  };

  onClose = () => {
    this.dialogRef?.close();
  };

  ngOnInit() {
    this.form = this.#fb.group({
      code: [null, [Validators.required, this.validatorsService.minLengthValidator(6)]]
    });
  }
}
