import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { User } from '@neo-edge-web/models';
import { UsersStore } from '../../stores/users.store';

@Component({
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  template: `
    <h1 mat-dialog-title>Disable MFA</h1>
    <mat-dialog-content>
      <div>
        Disabling MFA(Multi Factor Authentication) reduces the level of security on
        <span color="danger"> {{ data.user.name }} </span>
        account.
      </div>
      <div>Please input user’s email to confirm this action.</div>
    </mat-dialog-content>
    <mat-dialog-actions class="dialog__action">
      <div class="gl-fill-remaining-space"></div>
      <button type="button" mat-stroked-button mat-dialog-close id="users-disable-mfa-dialog-cancel">Cancel</button>
      <button type="button" mat-flat-button color="warn" (click)="onDisable()" id="users-disable-mfa-dialog-disable">
        Disable
      </button>
    </mat-dialog-actions>
  `,

  styleUrl: './disable-mfa-confirm-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DisableMfaConfirmDialogComponent {
  dialogRef!: MatDialogRef<DisableMfaConfirmDialogComponent>;
  data = inject<{ user: User; usersStore: UsersStore }>(MAT_DIALOG_DATA);

  onClose = () => {
    this.dialogRef.close();
  };

  onDisable = () => {
    const userRole = this.data.usersStore.roleList().find((d) => d.name === this.data.user.roleName);
    const userId = this.data.user.id;
    this.data.usersStore.editUserStatus({
      userId,
      payload: { roleId: userRole.id, status: this.data.user.accountStatus, isMfaEnable: 0 }
    });
  };
}
