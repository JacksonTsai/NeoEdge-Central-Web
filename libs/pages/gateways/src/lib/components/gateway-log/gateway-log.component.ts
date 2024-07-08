import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  EventEmitter,
  input,
  Output,
  signal
} from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  EVENT_LOG_SORT,
  IEventDoc,
  IEventLog,
  IGetEventLogsResp,
  TGetGatewayEventLogsParams,
  TGetGatewayEventLogsReq,
  TUpdateEventLogMode
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
    MatSelectModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatIconModule,
    MatTableModule,
    MatTooltipModule,
    dateTimeFormatPipe
  ],
  templateUrl: './gateway-log.component.html',
  styleUrl: './gateway-log.component.scss',
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GatewayLogComponent implements AfterViewInit {
  @Output() handleUpdateEventLogs = new EventEmitter<TGetGatewayEventLogsReq>();
  isActive = input<boolean>(false);
  eventDoc = input<IEventDoc>();
  eventLogsList = input<IGetEventLogsResp>();
  searchNameCtrl = new FormControl();
  searchEventId = signal<number[]>([]);
  searchDateRangeGroup = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null)
  });
  searchSort = new FormControl<EVENT_LOG_SORT>(EVENT_LOG_SORT.Descend);
  eventLogsSort = EVENT_LOG_SORT;
  dispalyedColumns: string[] = ['timestamp', 'eventId', 'eventName', 'group', 'srouce', 'severity', 'content'];
  dataSource = new MatTableDataSource<any>([]);
  events = computed<IEventLog[]>(() => this.eventLogsList()?.events ?? []);

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

    effect(() => {
      this.dataSource.data = this.events();
      if (this.isActive() && !this.eventLogsList()) {
        this.onUpdate('GET');
      }
    });
  }

  getPastDay(days: number): Date {
    return new Date(this.now.getTime() - 24 * 60 * 60 * 1000 * days);
  }

  onCloseDatePicker(): void {
    if (!this.dateEndCtrl.value) {
      this.dateEndCtrl.setValue(this.now);
    }
    this.onUpdate('GET');
  }

  searchEventNames(keyword: string): number[] {
    if (!this.eventDoc()) return [];
    const lowerKeyword = keyword.toLowerCase();
    const result = Object.entries(this.eventDoc())
      .filter(([_, event]) => event.name.toLowerCase().includes(lowerKeyword))
      .map(([id, _]) => parseInt(id));
    return result.length ? result : [9999];
  }

  onUpdate(type: TUpdateEventLogMode) {
    const params: TGetGatewayEventLogsParams = {
      timeGe: Math.round(this.dateStartCtrl.value.getTime() / 1000),
      timeLe: Math.round(this.dateEndCtrl.value.getTime() / 1000),
      order: this.searchSort.value,
      size: 50,
      lastRecord: type === 'UPDATE' ? this.eventLogsList()?.lastEvaluatedKey : '',
      eventIds: this.searchEventId()
    };
    this.handleUpdateEventLogs.emit({ type, params });
  }

  ngAfterViewInit(): void {
    this.dataSource.data = this.events();
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
          this.onUpdate('GET');
        })
      )
      .subscribe();
  }
}
