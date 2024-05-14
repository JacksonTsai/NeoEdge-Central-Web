import { DatePipe, NgClass } from '@angular/common';
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
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  GATEWAYS_LOADING,
  GATEWAY_SSH_MODE,
  GW_CURRENT_MODE,
  Gateway,
  TableQueryForGateways
} from '@neo-edge-web/models';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { combineLatest, debounceTime, map, startWith, tap } from 'rxjs';

@UntilDestroy()
@Component({
  selector: 'ne-gateways',
  standalone: true,
  imports: [
    NgClass,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    DatePipe,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatTooltipModule
  ],
  templateUrl: './gateways.component.html',
  styleUrl: './gateways.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GatewaysComponent implements AfterViewInit {
  @Output() pageChange = new EventEmitter<TableQueryForGateways>();
  @Output() handleAddGateway = new EventEmitter();
  @Output() handleManageLabels = new EventEmitter();
  @Output() handleGatewayDetail = new EventEmitter<Gateway>();

  gatewayDataTable = input<Gateway[]>([]);
  page = input<number>(0);
  size = input<number>(0);
  gatewaysLength = input<number>(0);
  isLoading = input<GATEWAYS_LOADING>(GATEWAYS_LOADING.NONE);
  gwCurrentMode = GW_CURRENT_MODE;
  gwSshMode = GATEWAY_SSH_MODE;
  searchGatewayCtrl = new FormControl('');
  searchLabelCtrl = new FormControl('');
  displayedColumns: string[] = [
    'no',
    'gatewayIcon',
    'gatewayModel',
    'name',
    'tagNumber',
    'sshMode',
    'labels',
    'action'
  ];

  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor() {
    effect(() => {
      this.dataSource.data = this.gatewayDataTable();
    });
  }

  addGateway = () => {
    this.handleAddGateway.emit();
  };

  onMangeLabel = () => {
    this.handleManageLabels.emit();
  };

  onGatewayDetail = (row: Gateway) => {
    this.handleGatewayDetail.emit(row);
  };

  ngAfterViewInit() {
    this.dataSource.data = this.gatewayDataTable();
    this.paginator.page
      .pipe(
        tap((page) => {
          this.pageChange.emit({ page: page.pageIndex + 1, size: page.pageSize });
        }),
        untilDestroyed(this)
      )
      .subscribe();

    combineLatest([this.searchGatewayCtrl.valueChanges, this.searchLabelCtrl.valueChanges])
      .pipe(
        startWith(['', '']),
        untilDestroyed(this),
        debounceTime(250),
        map(([gatewayName, label]) => {
          // 須確認第一次觸發時機
          console.log(gatewayName, label);
        })
      )
      .subscribe();

    // this.searchGatewayCtrl.valueChanges
    //   .pipe(
    //     debounceTime(250),
    //     tap((str) => {
    //       if (str) {
    //         this.pageChange.emit({ page: 1, size: this.size(), names: str, label: this.searchLabelCtrl.value });
    //       } else {
    //         this.pageChange.emit({ page: 1, size: this.size() });
    //       }
    //     }),
    //     untilDestroyed(this)
    //   )
    //   .subscribe();

    // this.searchLabelCtrl.valueChanges
    //   .pipe(
    //     debounceTime(250),
    //     tap((str) => {
    //       if (str) {
    //         this.pageChange.emit({ page: 1, size: this.size(), names:this.searchGatewayCtrl.value str, label: str });
    //       } else {
    //         this.pageChange.emit({ page: 1, size: this.size() });
    //       }
    //     }),
    //     untilDestroyed(this)
    //   )
    //   .subscribe();
  }
}
