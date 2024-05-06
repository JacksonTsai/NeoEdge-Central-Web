import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AbstractControl, ReactiveFormsModule, UntypedFormControl, ValidationErrors, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { User } from '@neo-edge-web/models';
import { UsersStore } from '../../stores/users.store';

@Component({
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatDialogModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule],
  template: `
    <h1 mat-dialog-title>Delete {{ data.user.name ? data.user.name : data.user.account }} account?</h1>
    <mat-dialog-content>
      <div>
        You are going to delete user(
        <span color="danger">
          {{ data.user.account }}
        </span>
        ).
      </div>
      <div>Please input user’s email to confirm this action.</div>

      <mat-form-field appearance="outline" floatLabel="always">
        <mat-label>Input role name</mat-label>
        <input matInput [formControl]="userNameCtrl" type="text" maxlength="128" id="roles-delete-dialog-name" />
        @if (userNameCtrl.hasError('required')) {
        <mat-error>Required.</mat-error>
        } @else if (userNameCtrl.hasError('incorrectName')) {
        <mat-error>The input verification content is incorrect.</mat-error>
        }
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions class="dialog__action">
      <div class="gl-fill-remaining-space"></div>
      <button type="button" mat-stroked-button mat-dialog-close id="users-delete-dialog-cancel">Cancel</button>
      <button
        type="button"
        mat-flat-button
        color="warn"
        (click)="onDelete()"
        id="users-delete-dialog-delete"
        [disabled]="userNameCtrl.invalid"
      >
        Delete
      </button>
    </mat-dialog-actions>
  `,

  styleUrl: './delete-confirm-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeleteConfirmDialogComponent {
  dialogRef!: MatDialogRef<DeleteConfirmDialogComponent>;
  data = inject<{ user: User; usersStore: UsersStore }>(MAT_DIALOG_DATA);

  incorrectRoleName = (control: AbstractControl): ValidationErrors | null => {
    return control.value === this.data.user.account ? null : { incorrectName: true };
  };

  userNameCtrl = new UntypedFormControl('', [Validators.required, this.incorrectRoleName]);

  onClose = () => {
    this.dialogRef.close();
  };

  onDelete = () => {
    const userId = this.data.user.id;
    this.data.usersStore.deleteUser({ userId, account: this.data.user.account });
  };
}
