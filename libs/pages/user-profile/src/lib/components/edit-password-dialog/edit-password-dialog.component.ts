import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormService, UserService, ValidatorsService } from '@neo-edge-web/global-services';
import { IEditPasswordReq, IGetUserProfileResp } from '@neo-edge-web/models';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { catchError, EMPTY, tap } from 'rxjs';

@UntilDestroy()
@Component({
  selector: 'ne-edit-password-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './edit-password-dialog.component.html',
  styleUrl: './edit-password-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditPasswordDialogComponent implements OnInit, OnDestroy {
  dialog = inject(MatDialog);
  data = inject<{ userInfo: IGetUserProfileResp }>(MAT_DIALOG_DATA);
  #fb = inject(FormBuilder);
  #snackBar = inject(MatSnackBar);
  formService = inject(FormService);
  userService = inject(UserService);
  validatorsService = inject(ValidatorsService);
  form: UntypedFormGroup;

  get oldPasswordCtrl() {
    return this.form.get('oldPassword') as UntypedFormControl;
  }

  get newPasswordCtrl() {
    return this.form.get('newPassword') as UntypedFormControl;
  }

  get confirmPasswordCtrl() {
    return this.form.get('confirmPassword') as UntypedFormControl;
  }

  resetPassword = () => {
    const payload: IEditPasswordReq = {
      oldPassword: this.oldPasswordCtrl.value,
      newPassword: this.newPasswordCtrl.value
    };

    this.userService
      .editPassword$({ ...payload })
      .pipe(
        untilDestroyed(this),
        tap(() => this.dialog.closeAll()),
        catchError(() => EMPTY)
      )
      .subscribe();
  };

  onSubmit = () => {
    if (this.form.invalid) {
      return;
    }
    this.resetPassword();
  };

  ngOnInit() {
    this.form = this.#fb.group(
      {
        oldPassword: [null, [Validators.required]],
        newPassword: [null, [Validators.required, this.validatorsService.passwordValidator()]],
        confirmPassword: [null, [Validators.required, this.validatorsService.matchValidator('newPassword')]]
      },
      { validator: [this.validatorsService.match2Field('newPassword', 'confirmPassword')] }
    );
  }

  ngOnDestroy(): void {
    this.formService.clearPasswordHiddenMap();
  }
}
