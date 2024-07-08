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
import { INeoflow, NEOFLOW_LOADING, PERMISSION, TTableQueryForNeoFlows } from '@neo-edge-web/models';
import { dateTimeFormatPipe } from '@neo-edge-web/pipes';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { NgxPermissionsModule } from 'ngx-permissions';
import { debounceTime, tap } from 'rxjs';

@UntilDestroy()
@Component({
  selector: 'ne-neoflows',
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
    MatMenuModule,
    dateTimeFormatPipe,
    NgxPermissionsModule
  ],
  templateUrl: './neoflows.component.html',
  styleUrl: './neoflows.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NeoFlowsComponent implements AfterViewInit {
  @Output() handlePageChange = new EventEmitter<TTableQueryForNeoFlows>();
  @Output() handleCreateNeoFlow = new EventEmitter();
  @Output() handleDeleteNeoFlow = new EventEmitter();
  @Output() handleCopyNeoFlow = new EventEmitter();
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  permission = PERMISSION;
  neoflows = input<INeoflow[]>([]);
  neoflowsLength = input<number>(0);
  page = input<number>(0);
  size = input<number>(0);
  isLoading = input<NEOFLOW_LOADING>(NEOFLOW_LOADING.NONE);

  displayedColumns: string[] = ['no', 'name', 'version', 'tag', 'runInGateway', 'createdBy', 'createdAt', 'action'];

  searchCtrl = new FormControl('');
  dataSource = new MatTableDataSource<any>([]);

  constructor() {
    effect(() => {
      this.dataSource.data = this.neoflows();
    });
  }

  onCreateNeoFlow = () => {
    this.handleCreateNeoFlow.emit();
  };

  onDeleteNeoFlow = (element) => {
    this.handleDeleteNeoFlow.emit(element);
  };

  onCopyNeoFlow = (element) => {
    this.handleCopyNeoFlow.emit(element);
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
            this.handlePageChange.emit({ page: 1, size: this.size(), name: str });
          } else {
            this.handlePageChange.emit({ page: 1, size: this.size() });
          }
        })
      )
      .subscribe();
  }
}
