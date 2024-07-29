import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  OnInit,
  Output,
  computed,
  inject,
  signal
} from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { IOtDevice, ITableQuery, OT_DEVICES_TABLE_MODE } from '@neo-edge-web/models';
import { OtDevicesComponent } from '@neo-edge-web/ot-devices-profile';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { debounceTime, tap } from 'rxjs';
import { CreateNeoFlowsStore } from '../../stores/create-neoflows.store';

@UntilDestroy()
@Component({
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, OtDevicesComponent],
  templateUrl: './add-tag-from-ot-device-dialog.component.html',
  styleUrl: './add-tag-from-ot-device-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddTagFromOtDeviceDialogComponent implements OnInit {
  @Output() handleAddOtDeviceTags = new EventEmitter();
  readonly dialogRef = inject(MatDialogRef<AddTagFromOtDeviceDialogComponent>);
  data = inject<{ createNeoFlowStore: CreateNeoFlowsStore }>(MAT_DIALOG_DATA);
  otDeviceTableMode = OT_DEVICES_TABLE_MODE;
  searchCtrl = new UntypedFormControl('');
  searchStr = signal<string>('');
  addedOt = this.data.createNeoFlowStore.addedOt;
  pageNumber = signal(1);
  pageSize = signal(10);

  addedOtDevices = computed(() => {
    const addedOtBySearch = this.addedOt().filter((d) => d.name.includes(this.searchStr()));
    const startIndex = (this.pageNumber() - 1) * this.pageSize();
    const endIndex = startIndex + this.pageSize();

    return addedOtBySearch.slice(startIndex, endIndex);
  });

  onAddOtDeviceToNeoFlow = (event: IOtDevice<any>) => {
    this.handleAddOtDeviceTags.emit(event);
  };

  onClose = () => {
    this.dialogRef.close();
  };

  onPageChange = (event: ITableQuery) => {
    if (event?.page) {
      this.pageNumber.set(event.page);
    }

    if (event?.size) {
      this.pageSize.set(event.size);
    }
  };

  ngOnInit() {
    this.searchCtrl.valueChanges
      .pipe(
        untilDestroyed(this),
        debounceTime(300),
        tap((str) => {
          this.searchStr.set(str);
        })
      )
      .subscribe();
  }
}
