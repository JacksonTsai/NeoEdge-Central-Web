import { DatePipe, NgClass } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
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
import { TableQueryForUsers, USERS_LOADING, USER_STATUE, User } from '@neo-edge-web/models';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { debounceTime, tap } from 'rxjs';

@UntilDestroy()
@Component({
  selector: 'ne-users',
  standalone: true,
  imports: [
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
    MatButtonModule,
    MatTooltipModule
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersComponent implements AfterViewInit, OnChanges {
  @Output() pageChange = new EventEmitter<TableQueryForUsers>();
  @Output() handlePermission = new EventEmitter();
  @Output() handleEnable = new EventEmitter<User>();
  @Output() handleDelete = new EventEmitter<User>();
  @Output() handleResendEmail = new EventEmitter<number>();
  @Output() handleInviteUser = new EventEmitter();
  @Output() handleDisableMFA = new EventEmitter<User>();

  userDataTable = input<User[]>([]);
  page = input<number>(0);
  size = input<number>(0);
  usersLength = input<number>(0);
  isLoading = input<USERS_LOADING>(USERS_LOADING.NONE);
  userStatus = USER_STATUE;
  searchCtrl = new FormControl('');

  displayedColumns: string[] = [
    'no',
    'account',
    'name',
    'roleName',
    'project',
    'isMfaEnable',
    'accountStatus',
    'action'
  ];

  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  onPermission = (element: User) => {
    this.handlePermission.emit(element);
  };

  onEnable = (element: User) => {
    this.handleEnable.emit(element);
  };

  onDelete = (element: User) => {
    this.handleDelete.emit(element);
  };

  onDisableMFA = (element: User) => {
    this.handleDisableMFA.emit(element);
  };

  onResendEmail = (user: User) => {
    this.handleResendEmail.emit(user.id);
  };

  onInviteUser = () => {
    this.handleInviteUser.emit();
  };

  getEmailName = (account: string) => {
    if (account) {
      const accountParts = account.split('@');
      return accountParts.length > 0 ? accountParts[0] : 'Nickname';
    } else {
      return 'Nickname';
    }
  };

  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes['userDataTable'] && !changes['userDataTable'].isFirstChange()) {
      this.dataSource.data = this.userDataTable();
    }
  }

  ngAfterViewInit() {
    this.dataSource.data = this.userDataTable();
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
        debounceTime(250),
        tap((str) => {
          if (str) {
            this.pageChange.emit({ page: 1, size: this.size(), accounts: str });
          } else {
            this.pageChange.emit({ page: 1, size: this.size() });
          }
        }),
        untilDestroyed(this)
      )
      .subscribe();
  }
}
