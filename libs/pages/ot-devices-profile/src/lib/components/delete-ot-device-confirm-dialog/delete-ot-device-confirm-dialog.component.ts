import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AbstractControl, FormControl, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { IOtDevice } from '@neo-edge-web/models';
import { OtDevicesStore } from '../../stores/ot-devcies.store';

@Component({
  selector: 'ne-delete-ot-device-confirm-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatInputModule, MatFormFieldModule, ReactiveFormsModule],
  templateUrl: './delete-ot-device-confirm-dialog.component.html',
  styleUrl: './delete-ot-device-confirm-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeleteOtDeviceConfirmDialogComponent {
  dialogRef!: MatDialogRef<DeleteOtDeviceConfirmDialogComponent>;
  data = inject<{ device: IOtDevice<any>; otDevicesStore: OtDevicesStore }>(MAT_DIALOG_DATA);

  incorrectDeviceName = (control: AbstractControl): ValidationErrors | null => {
    return control.value === this.data.device.name ? null : { incorrectDeviceName: true };
  };

  nameCtrl = new FormControl('', [Validators.required, this.incorrectDeviceName]);

  onDelete = () => {
    this.data.otDevicesStore.deleteOtDevice({ profileId: this.data.device.id, name: this.nameCtrl.value });
  };
}
