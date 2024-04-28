import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { User } from '@neo-edge-web/models';
import { UsersStore } from '../../stores/users.store';

@Component({
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatDialogModule, MatButtonModule],
  template: `
    <h1 mat-dialog-title>
      @if (data.actionType === 'enable') {
      <span> Restore this account? </span>
      } @else {
      <span> Suspend {{ data.user.name ? data.user.name : data.user.account }} account? </span>
      }
    </h1>
    <mat-dialog-content>
      @if (data.actionType === 'enable') {
      <div class="item">
        <div class="label">Name</div>
        <div class="value">{{ data.user.name ? data.user.name : '-' }}</div>
      </div>

      <div class="item">
        <div class="label">Email</div>
        <div class="value">{{ data.user.account }}</div>
      </div>
      } @else {
      <ul>
        <li>The user won't be able to access this organization with NeoEdge</li>
        <li>
          All data of the suspended member will be retained. The member's account status will be labelled as 'Inactive'.
        </li>
      </ul>
      }
    </mat-dialog-content>
    <mat-dialog-actions class="dialog__action">
      <div class="gl-fill-remaining-space"></div>
      <button type="button" mat-stroked-button mat-dialog-close id="users-active-dialog-cancel">Cancel</button>
      <button type="button" mat-flat-button color="primary" (click)="onConfirm()" id="users-active-dialog-submit">
        Submit
      </button>
    </mat-dialog-actions>
  `,
  styleUrl: './active-confirm-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActiveConfirmDialogComponent {
  dialogRef!: MatDialogRef<ActiveConfirmDialogComponent>;
  data = inject<{ actionType: 'disable' | 'enable'; user: User; usersStore: UsersStore }>(MAT_DIALOG_DATA);

  onClose = () => {
    this.dialogRef.close();
  };

  onConfirm = () => {
    const userRole = this.data.usersStore.roleList().find((d) => d.name === this.data.user.roleName);
    const status = this.data.actionType === 'enable' ? 1 : 2;
    if (userRole && userRole?.name) {
      this.data.usersStore.editUserStatus({
        userId: this.data.user.id,
        payload: { roleId: userRole.id, status, isMfaEnable: this.data.user.isMfaEnable }
      });
    }
  };
}
