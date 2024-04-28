import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, UntypedFormControl, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { IInviteUserReq, IRole } from '@neo-edge-web/models';
import { UsersStore } from '../../stores/users.store';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatInputModule
  ],
  templateUrl: './invite-user-dialog.component.html',
  styleUrl: './invite-user-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InviteUserDialogComponent implements OnInit {
  #fb = inject(FormBuilder);
  dialogRef= inject(MatDialogRef<InviteUserDialogComponent>);
  data = inject<{ usersStore: UsersStore }>(MAT_DIALOG_DATA);
  form!: FormGroup;
  roleOpt = [...this.data.usersStore.roleList()];


  get accountCtrl() {
    return this.form.get('account') as UntypedFormControl;
  }

  get roleCtrl() {
    return this.form.get('role') as UntypedFormControl;
  }

  onClose = () => {
    this.dialogRef.close();
  };

  onSubmit = () => {
    if (this.form.invalid) {
      return;
    }
    const payload: IInviteUserReq = {
      account: this.accountCtrl.value,
      roleId: (this.roleCtrl.value as IRole).id
    };
    this.data.usersStore.inviteUser(payload);
  };

  ngOnInit() {
    this.form = this.#fb.group({
      account: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required]
    });
  }
}
