import { CommonModule, JsonPipe, NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { User } from '@neo-edge-web/models';
import { UsersStore } from '../../stores/users.store';

@Component({
  standalone: true,
  imports: [
    MatDialogModule,
    MatSelectModule,
    MatFormFieldModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatChipsModule,
    CommonModule,
    MatIconModule,
    JsonPipe,
    NgIf,
    NgFor
  ],
  templateUrl: './user-permission-dialog.component.html',
  styleUrl: './user-permission-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserPermissionDialogComponent implements OnInit {
  dialogRef!: MatDialogRef<UserPermissionDialogComponent>;
  data: { user: User; usersStore: UsersStore } = inject(MAT_DIALOG_DATA);
  form!: FormGroup;
  roleOpt = [...this.data.usersStore.roleList()];
  #fb = inject(FormBuilder);

  get roleCtrl() {
    return this.form.get('role') as FormControl;
  }

  ngOnInit() {
    this.form = this.#fb.group({
      role: [this.data.usersStore.roleList().find((d) => d.name === this.data.user.roleName)]
    });
  }

  onClose = () => {
    this.dialogRef.close();
  };

  onSubmit = () => {
    const userId = this.data.user.id;
    const status = this.data.user.accountStatus;
    const roleId = this.roleCtrl?.value?.id;
    if (roleId) {
      this.data.usersStore.editUserStatus({
        userId,
        payload: { roleId, status, isMfaEnable: this.data.user.isMfaEnable }
      });
    }
  };
}
