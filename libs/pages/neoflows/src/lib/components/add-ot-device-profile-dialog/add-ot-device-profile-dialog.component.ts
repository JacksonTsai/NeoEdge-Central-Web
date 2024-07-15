import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Output, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { IOtDevice, OT_DEVICES_TABLE_MODE, TTableQueryForOtDevices } from '@neo-edge-web/models';
import { OtDevicesComponent, OtDevicesStore } from '@neo-edge-web/ot-devices-profile';

@Component({
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, OtDevicesComponent],
  templateUrl: './add-ot-device-profile-dialog.component.html',
  styleUrl: './add-ot-device-profile-dialog.component.scss',
  providers: [OtDevicesStore],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddOtDeviceProfileDialogComponent {
  @Output() handleAddOtDevice = new EventEmitter();
  readonly dialogRef = inject(MatDialogRef<AddOtDeviceProfileDialogComponent>);
  #otDevicesStore = inject(OtDevicesStore);
  otDeviceTableMode = OT_DEVICES_TABLE_MODE;
  otDevices = this.#otDevicesStore.otDevices;
  tablePage = this.#otDevicesStore.page;
  tableSize = this.#otDevicesStore.size;
  otDevicesLength = this.#otDevicesStore.otDevicesLength;
  isLoading = this.#otDevicesStore.isLoading;

  onAddOtDeviceToNeoFlow = (event: IOtDevice<any>) => {
    this.handleAddOtDevice.emit(event);
  };

  onClose = () => {
    this.dialogRef.close();
  };

  onPageChange = (event: TTableQueryForOtDevices) => {
    this.#otDevicesStore.queryOtDevicesTableByPage(event);
  };
}
