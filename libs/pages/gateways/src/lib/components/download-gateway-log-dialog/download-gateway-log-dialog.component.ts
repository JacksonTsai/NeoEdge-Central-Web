import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  UntypedFormControl,
  UntypedFormGroup
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ISelectedItem, NeMultiSelectChipsComponent } from '@neo-edge-web/components';
import { EVENT_LOG_SORT, IDownloadGatewayEventLogsReq, IEventDoc } from '@neo-edge-web/models';
import { getPastDay } from '@neo-edge-web/utils';
import { GatewayDetailStore } from '../../stores/gateway-detail.store';

@Component({
  selector: 'ne-download-gateway-log-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatDatepickerModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    NeMultiSelectChipsComponent
  ],
  templateUrl: './download-gateway-log-dialog.component.html',
  styleUrl: './download-gateway-log-dialog.component.scss',
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DownloadGatewayLogDialogComponent implements OnInit {
  data = inject<{ gwDetailStore: GatewayDetailStore; eventDoc: IEventDoc; params: IDownloadGatewayEventLogsReq }>(
    MAT_DIALOG_DATA
  );
  #fb = new FormBuilder();
  form: UntypedFormGroup;
  private readonly now = new Date();
  readonly minDate: Date = getPastDay(90);
  readonly maxDate: Date = this.now;
  eventLogsSort = EVENT_LOG_SORT;

  eventList = computed<ISelectedItem[]>(() => {
    if (!this.data.eventDoc) return [];
    return Object.entries(this.data?.eventDoc).map(([key, value]) => ({
      id: parseInt(key, 10),
      value: key,
      label: `${key}: ${value.name}`
    }));
  });

  get dateStartCtrl() {
    return this.form.get('start') as FormControl<Date | null>;
  }

  get dateEndCtrl() {
    return this.form.get('end') as FormControl<Date | null>;
  }

  get sortCtrl() {
    return this.form.get('sort') as UntypedFormControl;
  }

  get typeCtrl() {
    return this.form.get('type') as UntypedFormControl;
  }

  onCloseDatePicker = (): void => {
    if (!this.dateEndCtrl.value) {
      this.dateEndCtrl.setValue(this.now);
    }
  };

  onDownload = (): void => {
    const params: IDownloadGatewayEventLogsReq = {
      timeGe: Math.round(this.dateStartCtrl.value.getTime() / 1000),
      timeLe: Math.round(this.dateEndCtrl.value.getTime() / 1000),
      order: this.sortCtrl.value,
      eventIds: this.getEventId(),
      timeZone: this.data.params.timeZone
    };
    this.data.gwDetailStore.downloadEventLogsCsv(params);
  };

  setDownloadEventType = (): ISelectedItem[] => {
    let result: ISelectedItem[];
    const eventIds = this.data.params.eventIds;
    if (eventIds.length === 0 || eventIds.includes(9999)) {
      result = this.eventList();
    } else {
      result = this.eventList().filter((event) => eventIds.includes(event.id));
    }
    return result;
  };

  getEventId = (): number[] => {
    const eventDocKeys = Object.keys(this.data.eventDoc);
    if (this.typeCtrl.value.length === eventDocKeys.length) return [];
    return this.typeCtrl.value.map((item) => item.id);
  };

  ngOnInit(): void {
    this.form = this.#fb.group({
      start: [new Date(this.data.params.timeGe * 1000)],
      end: [new Date(this.data.params.timeLe * 1000)],
      sort: [this.data.params.order],
      type: [this.setDownloadEventType()]
    });
  }
}
