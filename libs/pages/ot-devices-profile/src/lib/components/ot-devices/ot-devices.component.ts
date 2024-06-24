import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
  ViewChild,
  effect,
  input
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DEVICE_TYPE, IInstancesRtu, IInstancesTcp, IOtDevice, OT_DEVICES_LOADING } from '@neo-edge-web/models';
import { datetimeFormat } from '@neo-edge-web/utils';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { debounceTime, tap } from 'rxjs';

@UntilDestroy()
@Component({
  selector: 'ne-ot-devices',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatCardModule,
    MatPaginatorModule,
    MatTooltipModule,
    MatMenuModule
  ],
  templateUrl: './ot-devices.component.html',
  styleUrl: './ot-devices.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OtDevicesComponent implements AfterViewInit {
  @Output() handleDetailDevice = new EventEmitter<any>();
  @Output() handleDeleteDevice = new EventEmitter<IOtDevice<any>>();
  @Output() handleCopyDevice = new EventEmitter<any>();
  @Output() handleCreateDevice = new EventEmitter<any>();
  @Output() handlePageChange = new EventEmitter<any>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  otDevices = input<IOtDevice<any>[]>([]);
  page = input<number>(0);
  size = input<number>(0);
  devicesLength = input<number>(0);
  displayedColumns: string[] = [
    'no',
    'name',
    'iconPath',
    'type',
    'connection',
    'tag',
    'createdBy',
    'createdAt',
    'action'
  ];

  isLoading = input<OT_DEVICES_LOADING>(OT_DEVICES_LOADING.NONE);
  searchCtrl = new FormControl('');
  dataSource = new MatTableDataSource<any>([]);

  constructor() {
    effect(() => {
      this.dataSource.data = this.otDevices();
    });
  }

  deviceType = (device: IOtDevice<any>): DEVICE_TYPE => {
    return device.appClass.toLowerCase().includes('modbus tcp')
      ? DEVICE_TYPE.MODBUS_TCP
      : device.appClass.toLowerCase().includes('modbus rtu')
        ? DEVICE_TYPE.MODBUS_RTU
        : device.appClass.toLowerCase().includes('texol')
          ? DEVICE_TYPE.TEXOL
          : DEVICE_TYPE.NONE;
  };

  otDeviceConnectionInfo = (element: IOtDevice<any>): { slaveId: number; port: number; ip?: string } => {
    let connectionInfo;
    const deviceType = this.deviceType(element);
    if (DEVICE_TYPE.MODBUS_TCP === deviceType) {
      const deviceData = element as IOtDevice<IInstancesTcp>;
      connectionInfo = {
        slaveId: deviceData.setting.Instances.TCP[0].Devices[0].SlaveID,
        ip: deviceData.setting.Instances.TCP[0].Properties.IP,
        port: deviceData.setting.Instances.TCP[0].Properties.Port
      };
    } else if (DEVICE_TYPE.MODBUS_RTU === deviceType || DEVICE_TYPE.TEXOL === deviceType) {
      const deviceData = element as IOtDevice<IInstancesRtu>;
      connectionInfo = {
        slaveId: deviceData.setting.Instances.RTU[0].Devices[0].SlaveID
      };
    } else {
      connectionInfo = {
        slaveId: '-'
      };
    }

    return connectionInfo;
  };

  onDetailDevice = (device) => {
    if (device) {
      this.handleDetailDevice.emit(device);
    }
  };

  onDeleteDevice = (device: IOtDevice<any>) => {
    if (device) {
      this.handleDeleteDevice.emit(device);
    }
  };

  onCopyDevice = (device) => {
    this.handleCopyDevice.emit(device);
  };

  onCreateDevice = () => {
    this.handleCreateDevice.emit();
  };

  getFormatDate(timestamp: number) {
    return isNaN(timestamp) ? '-' : datetimeFormat(timestamp);
  }

  calcTag = (element: IOtDevice<any>) => {
    const deviceType = this.deviceType(element);
    if (DEVICE_TYPE.MODBUS_TCP === deviceType) {
      const deviceData = element as IOtDevice<IInstancesTcp>;
      return Object.keys(deviceData.setting?.Instances.TCP[0].Devices[0]?.Commands)?.length ?? 0;
    } else if (DEVICE_TYPE.MODBUS_RTU === deviceType) {
      const deviceData = element as IOtDevice<IInstancesRtu>;
      return Object.keys(deviceData.setting?.Instances.RTU[0].Devices[0]?.Commands)?.length ?? 0;
    } else if (DEVICE_TYPE.TEXOL === deviceType) {
      const deviceData = element as IOtDevice<IInstancesRtu>;
      if ('General.profile' === deviceData.setting?.Instances.RTU[0].Devices[0].Profile.Name) {
        if (deviceData.setting?.Instances.RTU[0].Devices[0]?.Profile?.Domains?.length > 0) {
          return deviceData.setting?.Instances.RTU[0]?.Devices[0]?.Profile?.Domains?.join(',') ?? '-';
        }
      } else {
        const texolProfileSplit = deviceData.setting?.Instances.RTU[0].Devices[0]?.Profile?.Name.split('.');
        texolProfileSplit.pop();
        return texolProfileSplit.join('.') ?? '-';
      }
    }
    return '-';
  };

  ngAfterViewInit() {
    this.paginator.page
      .pipe(
        tap((page) => {
          this.handlePageChange.emit({ page: page.pageIndex + 1, size: page.pageSize });
        }),
        untilDestroyed(this)
      )
      .subscribe();

    this.searchCtrl.valueChanges
      .pipe(
        untilDestroyed(this),
        debounceTime(300),
        tap((str) => {
          if (str) {
            this.handlePageChange.emit({ page: 1, size: this.size(), names: str });
          } else {
            this.handlePageChange.emit({ page: 1, size: this.size() });
          }
        })
      )
      .subscribe();
  }
}
