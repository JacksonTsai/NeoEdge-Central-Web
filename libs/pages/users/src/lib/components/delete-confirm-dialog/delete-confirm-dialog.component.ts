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
    </mat-dialog-content>
    <mat-dialog-actions class="dialog__action">
      <div class="gl-fill-remaining-space"></div>
      <button type="button" mat-stroked-button mat-dialog-close id="users-delete-dialog-cancel">Cancel</button>
      <button type="button" mat-flat-button color="warn" (click)="onDelete()" id="users-delete-dialog-delete">
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

  onClose = () => {
    this.dialogRef.close();
  };

  onDelete = () => {
    const userId = this.data.user.id;
    this.data.usersStore.deleteUser({ userId });
  };
}
