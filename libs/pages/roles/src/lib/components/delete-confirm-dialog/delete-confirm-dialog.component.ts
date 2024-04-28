import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AbstractControl, ReactiveFormsModule, UntypedFormControl, ValidationErrors, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { IRole } from '@neo-edge-web/models';
import { RolesStore } from '../../stores/roles.store';

@Component({
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatDialogModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule],
  templateUrl: './delete-confirm-dialog.component.html',
  styleUrl: './delete-confirm-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeleteConfirmDialogComponent {
  dialogRef!: MatDialogRef<DeleteConfirmDialogComponent>;
  data = inject<{ role: IRole; rolesStore: RolesStore }>(MAT_DIALOG_DATA);

  incorrectRoleName = (control: AbstractControl): ValidationErrors | null => {
    return control.value === this.data.role.name ? null : { incorrectRoleName: true };
  };

  roleNameCtrl = new UntypedFormControl('', [Validators.required, this.incorrectRoleName]);

  onClose = () => {
    this.dialogRef.close();
  };

  onDelete = () => {
    if (this.roleNameCtrl.valid) {
      this.data.rolesStore.deleteUser({ roleId: this.data.role.id });
    }
  };
}
