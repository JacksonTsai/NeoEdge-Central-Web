import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  UntypedFormControl,
  UntypedFormGroup,
  Validators
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { IAllPermission, IEditRoleReq, IGetRoleByIdResp } from '@neo-edge-web/models';
import { whitespaceValidator } from '@neo-edge-web/validators';
import { RolesStore } from '../../stores/roles.store';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatInputModule,
    FormsModule,
    MatIconModule,
    MatTooltipModule
  ],
  templateUrl: './edit-role-dialog.component.html',
  styleUrl: './edit-role-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditRoleDialogComponent implements OnInit {
  #fb = inject(FormBuilder);
  form!: UntypedFormGroup;
  dialogRef!: MatDialogRef<EditRoleDialogComponent>;
  data = inject<{
    roleId: number;
    role: IGetRoleByIdResp | null;
    rolesStore: RolesStore;
    permissionOpts: IAllPermission[];
  }>(MAT_DIALOG_DATA);

  get isEditMode() {
    return this.data.role ? true : false;
  }

  permissionOpts = signal([...this.data.permissionOpts.map((d) => ({ ...d, checked: false }))]);

  isSelectedPermissionOpts = computed(() => {
    return this.permissionOpts().findIndex((d) => d.checked) > -1 ? true : false;
  });

  get nameCtrl() {
    return this.form.get('name') as UntypedFormControl;
  }

  get descriptionCtrl() {
    return this.form.get('description') as UntypedFormControl;
  }

  changeSelectedPermission = (permission, checked) => {
    this.permissionOpts.set(
      this.permissionOpts().map((data) => {
        if (data.permissionId === permission.permissionId) {
          return { ...permission, checked };
        } else {
          return data;
        }
      })
    );
  };

  onClose() {
    this.dialogRef.close();
  }

  setInitFormValue = () => {
    this.form.patchValue({
      name: this.data.role.name,
      description: this.data.role.description
    });

    this.permissionOpts.set(
      this.permissionOpts().map((permission) => {
        return { ...permission, checked: this.data.role.permissions.includes(permission.permissionId) };
      })
    );
  };

  onSubmit = () => {
    if (this.form.invalid) {
      return;
    }
    if (this.nameCtrl.value.trim() === '') {
      return;
    }

    this.nameCtrl.setValue(this.nameCtrl.value.trim());
    const payload: IEditRoleReq = {
      description: this.descriptionCtrl.value,
      name: this.nameCtrl.value,
      permissions: [
        ...this.permissionOpts()
          .filter((permission) => permission.checked)
          .map((permission) => permission.permissionId)
      ]
    };
    if (this.isEditMode) {
      this.data.rolesStore.editRole({ roleId: this.data.roleId, payload });
    } else {
      this.data.rolesStore.addRole(payload);
    }
  };

  ngOnInit() {
    this.form = this.#fb.group({
      name: ['', [Validators.required, whitespaceValidator]],
      description: ['']
    });
    if (this.isEditMode) {
      this.setInitFormValue();
    }
  }
}
