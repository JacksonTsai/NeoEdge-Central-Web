import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, inject, Output, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { OT_DEVICE_PROFILE_MODE } from '@neo-edge-web/models';
import { CreateOtDevicesStore, CreateOtProfileComponent } from '@neo-edge-web/ot-devices-profile';

@Component({
  selector: 'ne-add-new-ot-device-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, CreateOtProfileComponent],
  templateUrl: './add-new-ot-device-dialog.component.html',
  styleUrl: './add-new-ot-device-dialog.component.scss',
  providers: [CreateOtDevicesStore],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddNewOtDeviceDialogComponent {
  @Output() createNewOtDevice = new EventEmitter();
  @Output() createAndSaveOtDevice = new EventEmitter();
  @ViewChild(CreateOtProfileComponent) createOtProfileComponent: CreateOtProfileComponent;
  #createOtDevicesStore = inject(CreateOtDevicesStore);

  supportDevices = this.#createOtDevicesStore.supportDevices;
  texolTagDoc = this.#createOtDevicesStore.texolTagDoc;
  readonly dialogRef = inject(MatDialogRef<AddNewOtDeviceDialogComponent>);
  data = inject<any>(MAT_DIALOG_DATA);
  otDeviceProfileMode = OT_DEVICE_PROFILE_MODE;

  onClose = () => {
    this.dialogRef.close();
  };
}
