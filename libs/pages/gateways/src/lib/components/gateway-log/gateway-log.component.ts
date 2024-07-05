import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  EventEmitter,
  input,
  Output,
  signal
} from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import {
  EVENT_LOG_SORT,
  IEventDoc,
  IEventLog,
  IGetEventLogsResp,
  TGetGatewayEventLogsParams,
  TGetGatewayEventLogsReq
} from '@neo-edge-web/models';
import { dateTimeFormatPipe } from '@neo-edge-web/pipes';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { debounceTime, tap } from 'rxjs';

@UntilDestroy()
@Component({
  selector: 'ne-gateway-log',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatIconModule,
    MatTableModule,
    MatMenuModule,
    dateTimeFormatPipe
  ],
  templateUrl: './gateway-log.component.html',
  styleUrl: './gateway-log.component.scss',
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'ja-JP' }, provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GatewayLogComponent implements AfterViewInit {
  @Output() handleUpdateEventLogs = new EventEmitter<TGetGatewayEventLogsReq>();
  eventDoc = input<IEventDoc>();
  eventLogsList = input<IGetEventLogsResp>();
  searchNameCtrl = new FormControl();
  searchEventId = signal<number[]>([]);
  searchDateRangeGroup = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null)
  });
  searchSort = signal<EVENT_LOG_SORT>(EVENT_LOG_SORT.Descend);
  eventLogsSort = EVENT_LOG_SORT;
  dispalyedColumns: string[] = ['timestamp', 'eventId', 'eventName', 'group', 'srouce', 'severity', 'content'];

  events = computed<IEventLog[]>(() => this.eventLogsList()?.events ?? []);

  dataSource = new MatTableDataSource<any>([]);

  private readonly now = new Date();
  readonly minDate = this.getPastDay(90);
  readonly maxDate = this.now;

  get dateStartCtrl() {
    return this.searchDateRangeGroup.get('start') as FormControl<Date | null>;
  }

  get dateEndCtrl() {
    return this.searchDateRangeGroup.get('end') as FormControl<Date | null>;
  }

  constructor() {
    this.dateStartCtrl.setValue(this.getPastDay(7));
    this.dateEndCtrl.setValue(this.now);
  }

  getPastDay(day: number): Date {
    return new Date(this.now.getTime() - 24 * 60 * 60 * 1000 * day);
  }

  changeSort(sort: EVENT_LOG_SORT) {
    this.searchSort.set(sort);
  }

  searchEventNames(keyword: string): number[] {
    if (!this.eventDoc()) return [];
    const lowerKeyword = keyword.toLowerCase();
    return Object.entries(this.eventDoc())
      .filter(([_, event]) => event.name.toLowerCase().includes(lowerKeyword))
      .map(([id, _]) => parseInt(id));
  }

  onUpdate() {
    const params: TGetGatewayEventLogsParams = {
      timeGe: this.dateStartCtrl.value.getTime(),
      timeLe: this.dateEndCtrl.value.getTime(),
      order: this.searchSort(),
      size: 50,
      // lastRecord?: string;
      eventIds: this.searchEventId()
    };
    this.handleUpdateEventLogs.emit({ type: 'UPDATE', params });
  }

  ngAfterViewInit(): void {
    this.onUpdate();

    this.searchNameCtrl.valueChanges
      .pipe(
        untilDestroyed(this),
        debounceTime(300),
        tap((str) => {
          if (str) {
            this.searchEventId.set(this.searchEventNames(str));
          } else {
            this.searchEventId.set([]);
          }
        })
      )
      .subscribe();
  }
}
