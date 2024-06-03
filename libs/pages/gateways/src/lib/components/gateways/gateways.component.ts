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
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SafePipe } from '@neo-edge-web/directives';
import {
  BOOLEAN_STATUS,
  GATEWAYS_LOADING,
  GATEWAY_SSH_MODE,
  GATEWAY_STATUE,
  GW_CURRENT_MODE,
  Gateway,
  IGatewayLabels,
  NEED_SYNC_GATEWAYS,
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
    MatTooltipModule,
    MatSelectModule,
    SafePipe,
    MatChipsModule
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
  gwLabels = input<IGatewayLabels[]>([]);
  isLoading = input<GATEWAYS_LOADING>(GATEWAYS_LOADING.NONE);
  gwCurrentMode = GW_CURRENT_MODE;
  gwSshMode = GATEWAY_SSH_MODE;
  gwStatus = GATEWAY_STATUE;
  needSyncGateway = NEED_SYNC_GATEWAYS;
  searchGatewayCtrl = new FormControl('');
  searchLabelCtrl = new FormControl('');
  displayedColumns: string[] = [
    'no',
    'gatewayIcon',
    'gatewayModel',
    'name',
    'status',
    'tagNumber',
    'neoflow',
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

  getImagePath = (element) => {
    if (!element.ipcVendorName || !element.ipcModelSeriesName) {
      return '/assets/images/default_gateway.png';
    }
    return `/assets/images/default_${element.ipcVendorName.toLowerCase()}_${element.ipcModelSeriesName}.png `;
  };

  logo = (element) => {
    if (!element) {
      return '';
    }

    if (element.gatewayIconPath) {
      return `${element.gatewayIconPath}?timestamp=${Date.now()}`;
    }

    if (!element.ipcVendorName || !element.ipcModelSeriesName) {
      return '/assets/images/default_gateway.png';
    }

    if (element.isPartnerIpc === BOOLEAN_STATUS.TRUE) {
      return `/assets/images/default_${element.ipcVendorName.toLowerCase()}_${element.ipcModelSeriesName}.png?timestamp=${Date.now()}`;
    } else {
      return '/assets/images/default_gateway.png';
    }
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

    combineLatest([
      this.searchGatewayCtrl.valueChanges.pipe(startWith('')),
      this.searchLabelCtrl.valueChanges.pipe(startWith(''))
    ])
      .pipe(
        untilDestroyed(this),
        debounceTime(250),
        map(([gatewayName, label]) => {
          const filterCondition = { page: 1, size: this.size() };
          if (gatewayName) {
            filterCondition['names'] = gatewayName;
          }
          if (label && label !== 'all') {
            filterCondition['labelIds'] = (label as any).id;
          }
          this.pageChange.emit({ ...filterCondition });
        })
      )
      .subscribe();
  }
}
