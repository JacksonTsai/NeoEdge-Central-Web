import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CopyProfileDialogComponent } from '@neo-edge-web/components';
import { IOtDevice, OT_DEVICES_LOADING, TTableQueryForOtDevices } from '@neo-edge-web/models';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { DeleteOtDeviceConfirmDialogComponent, OtDevicesComponent } from '../../components';
import { OtDevicesStore } from '../../stores/ot-devices.store';

@UntilDestroy()
@Component({
  selector: 'ne-ot-devices-page',
  standalone: true,
  imports: [CommonModule, OtDevicesComponent, MatDialogModule],
  template: `
    <ne-ot-devices
      [otDevices]="otDevices()"
      [page]="tablePage()"
      [size]="tableSize()"
      [devicesLength]="otDevicesLength()"
      (handleDetailDevice)="onDetailDevice($event)"
      (handleDeleteDevice)="onDeleteDevice($event)"
      (handleCopyDevice)="onCopyDevice($event)"
      (handleCreateDevice)="onCreateDevice()"
      (handlePageChange)="onPageChange($event)"
    >
    </ne-ot-devices>
  `,
  styleUrl: './ot-devices-page.component.scss',
  providers: [OtDevicesStore],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OtDevicesPageComponent {
  #otDevicesStore = inject(OtDevicesStore);
  #dialog = inject(MatDialog);
  #router = inject(Router);
  otDevices = this.#otDevicesStore.otDevices;
  tablePage = this.#otDevicesStore.page;
  tableSize = this.#otDevicesStore.size;
  otDevicesLength = this.#otDevicesStore.otDevicesLength;
  isLoading = this.#otDevicesStore.isLoading;

  constructor() {
    effect(
      () => {
        if (OT_DEVICES_LOADING.REFRESH_TABLE === this.isLoading()) {
          this.#otDevicesStore.queryOtDevicesTableByPage({ size: this.tableSize(), page: this.tablePage() });
        }
      },
      { allowSignalWrites: true }
    );
  }

  onDetailDevice = (event) => {
    this.#router.navigate([`/neoflow/ot-device-profile/${event.id}`]);
  };

  onDeleteDevice = (event: IOtDevice<any>) => {
    let editRoleDialogRef = this.#dialog.open(DeleteOtDeviceConfirmDialogComponent, {
      panelClass: 'med-dialog',
      disableClose: true,
      autoFocus: false,
      restoreFocus: false,
      data: { otDevicesStore: this.#otDevicesStore, device: event }
    });

    editRoleDialogRef
      .afterClosed()
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        editRoleDialogRef = undefined;
      });
  };

  onCopyDevice = (event: IOtDevice<any>) => {
    let copyProfileRef = this.#dialog.open(CopyProfileDialogComponent, {
      panelClass: 'med-dialog',
      disableClose: true,
      autoFocus: false,
      restoreFocus: false,
      data: {
        type: 'ot',
        copyFrom: { displayName: event.name, id: event.id },
        copyFn: this.#otDevicesStore.copyDevice
      }
    });

    copyProfileRef
      .afterClosed()
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        copyProfileRef = undefined;
      });
  };

  onCreateDevice = () => {
    this.#router.navigate([`neoflow/ot-device-profile/create`]);
  };

  onPageChange = (event: TTableQueryForOtDevices) => {
    this.#otDevicesStore.queryOtDevicesTableByPage(event);
  };
}
