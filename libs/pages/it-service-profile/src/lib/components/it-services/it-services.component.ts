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
import { RouterModule } from '@angular/router';
import {
  IItService,
  IT_SERVICE_LOADING,
  IT_SERVICE_TABLE_MODE,
  PERMISSION,
  TableQueryForItService
} from '@neo-edge-web/models';
import { dateTimeFormatPipe } from '@neo-edge-web/pipes';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { debounceTime, tap } from 'rxjs';

import { NgxPermissionsModule } from 'ngx-permissions';
@UntilDestroy()
@Component({
  selector: 'ne-it-services',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatMenuModule,
    dateTimeFormatPipe,
    NgxPermissionsModule
  ],
  templateUrl: './it-services.component.html',
  styleUrl: './it-services.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItServicesComponent implements AfterViewInit {
  @Output() pageChange = new EventEmitter<TableQueryForItService>();
  @Output() handleCreate = new EventEmitter();
  @Output() handleDelete = new EventEmitter<IItService>();
  @Output() handleCopy = new EventEmitter<IItService>();
  @Output() handleAddItServiceToNeoFlow = new EventEmitter<IItService>();
  @Output() handleDetailItServiceFromNeoFlow = new EventEmitter<IItService>();
  @Output() handleRemoveItServiceFromNeoFlow = new EventEmitter<{ otDeviceName: string }>();

  tableMode = input<IT_SERVICE_TABLE_MODE>(IT_SERVICE_TABLE_MODE.IT_SERVICE_VIEW);
  permission = PERMISSION;
  dataTable = input<IItService[]>();
  dataLength = input<number>(0);
  page = input<number>(0);
  size = input<number>(0);
  isLoading = input<IT_SERVICE_LOADING>(IT_SERVICE_LOADING.NONE);
  searchCtrl = new FormControl('');
  itServiceTableMode = IT_SERVICE_TABLE_MODE;

  get displayedColumns() {
    if (IT_SERVICE_TABLE_MODE.SELECTION === this.tableMode()) {
      return ['no', 'name', 'type', 'connection', 'createdBy', 'createdAt', 'selectionModeAction'];
    } else if (IT_SERVICE_TABLE_MODE.NEOFLOW_VIEW === this.tableMode()) {
      return ['no', 'name', 'type', 'connection', 'createdBy', 'createdAt', 'neoFlowViewModeAction'];
    } else {
      return ['no', 'name', 'type', 'connection', 'createdBy', 'createdAt', 'action'];
    }
  }

  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor() {
    effect(() => {
      this.dataSource.data = this.dataTable();
    });
  }

  onCreate = (): void => {
    this.handleCreate.emit();
  };

  onDelete = (row: IItService): void => {
    this.handleDelete.emit(row);
  };

  onCopy = (row: IItService): void => {
    this.handleCopy.emit(row);
  };

  onAddItServiceToNeoFlow = (element) => {
    if (IT_SERVICE_TABLE_MODE.SELECTION === this.tableMode()) {
      this.handleAddItServiceToNeoFlow.emit(element);
    }
  };

  onDetailItServiceFromNeoFlow = (element) => {
    if (IT_SERVICE_TABLE_MODE.NEOFLOW_VIEW === this.tableMode()) {
      this.handleDetailItServiceFromNeoFlow.emit(element);
    }
  };

  onRemoveItServiceFromNeoFlow = (element) => {
    if (IT_SERVICE_TABLE_MODE.NEOFLOW_VIEW === this.tableMode()) {
      this.handleRemoveItServiceFromNeoFlow.emit(element);
    }
  };

  ngAfterViewInit(): void {
    this.dataSource.data = this.dataTable();
    this.paginator.page
      .pipe(
        untilDestroyed(this),
        tap((page) => {
          this.pageChange.emit({ page: page.pageIndex + 1, size: page.pageSize });
        })
      )
      .subscribe();

    this.searchCtrl.valueChanges
      .pipe(
        untilDestroyed(this),
        debounceTime(300),
        tap((str) => {
          if (str) {
            this.pageChange.emit({ page: 1, size: this.size(), names: str });
          } else {
            this.pageChange.emit({ page: 1, size: this.size() });
          }
        })
      )
      .subscribe();
  }
}
