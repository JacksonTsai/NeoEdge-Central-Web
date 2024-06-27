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
import { NEOFLOW_LOADING } from '@neo-edge-web/models';
import { untilDestroyed } from '@ngneat/until-destroy';
import { debounceTime, tap } from 'rxjs';

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
    MatMenuModule
  ],
  templateUrl: './neoflows.component.html',
  styleUrl: './neoflows.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NeoflowsComponent implements AfterViewInit {
  @Output() handlePageChange = new EventEmitter<any>();
  @Output() handleCreateNeoFlow = new EventEmitter<any>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  neoflows = input<any[]>([]);
  page = input<number>(0);
  size = input<number>(0);
  devicesLength = input<number>(0);
  displayedColumns: string[] = [
    'no',
    'name',
    'version',
    'tag',
    'otDevice',
    'itService',
    'runInGateway',
    'createdBy',
    'createdAt',
    'action'
  ];

  isLoading = input<NEOFLOW_LOADING>(NEOFLOW_LOADING.NONE);
  searchCtrl = new FormControl('');
  dataSource = new MatTableDataSource<any>([]);

  constructor() {
    effect(() => {
      // this.dataSource.data = this.otDevices();
      console.log(this.isLoading());
    });
  }

  onCreate = () => {
    this.handleCreateNeoFlow.emit();
  };

  onCopy = () => {
    //
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
