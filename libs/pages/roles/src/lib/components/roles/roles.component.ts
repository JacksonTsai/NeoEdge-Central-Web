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
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { IRole, ROLES_LOADING, TableQueryForRoles } from '@neo-edge-web/models';
import { datetimeFormat } from '@neo-edge-web/utils';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { debounceTime, tap } from 'rxjs';

@UntilDestroy()
@Component({
  selector: 'ne-roles',
  standalone: true,
  imports: [
    MatTooltipModule,
    NgClass,
    MatProgressSpinnerModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    DatePipe,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule
  ],
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RolesComponent implements AfterViewInit {
  @Output() pageChange = new EventEmitter<TableQueryForRoles>();
  @Output() handleEditRole = new EventEmitter<{ role: IRole | null }>();
  @Output() handleDeleteRole = new EventEmitter<IRole>();

  roleDataTable = input<IRole[]>([]);
  page = input<number>(0);
  size = input<number>(0);
  rolesLength = input<number>(0);

  isLoading = input<ROLES_LOADING>(ROLES_LOADING.NONE);
  userStatus = ROLES_LOADING;
  searchCtrl = new FormControl('');

  displayedColumns: string[] = ['no', 'name', 'createBy', 'createDate', 'users', 'action'];
  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor() {
    effect(() => {
      this.dataSource.data = this.roleDataTable();
    });
  }

  onEditRole = (role?: IRole) => {
    if (role) {
      this.handleEditRole.emit({ role });
    } else {
      this.handleEditRole.emit({ role: null });
    }
  };

  onDeleteRole = (role: IRole) => {
    this.handleDeleteRole.emit(role);
  };

  includeUsers = (role: IRole) => {
    return role?.users?.length > 1 ? true : false;
  };

  isBuildIn = (role: IRole) => {
    return role?.createBy === 'NeoEdge Central' ? true : false;
  };

  getFormatDate(timestamp: number) {
    return isNaN(timestamp) ? '-' : datetimeFormat(timestamp);
  }

  ngAfterViewInit() {
    this.paginator.page
      .pipe(
        tap((page) => {
          this.pageChange.emit({ page: page.pageIndex + 1, size: page.pageSize });
        }),
        untilDestroyed(this)
      )
      .subscribe();

    this.searchCtrl.valueChanges
      .pipe(
        debounceTime(300),
        tap((str) => {
          if (str) {
            this.pageChange.emit({ page: 1, size: this.size(), names: str });
          } else {
            this.pageChange.emit({ page: 1, size: this.size() });
          }
        }),
        untilDestroyed(this)
      )
      .subscribe();
  }
}
