import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TableQueryForUsers, USERS_LOADING, User } from '@neo-edge-web/models';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { LetDirective } from '@ngrx/component';
import { ActiveConfirmDialogComponent } from '../../components/active-confirm-dialog/active-confirm-dialog.component';
import { DeleteConfirmDialogComponent } from '../../components/delete-confirm-dialog/delete-confirm-dialog.component';
import { DisableMfaConfirmDialogComponent } from '../../components/disable-mfa-confirm-dialog/disable-mfa-confirm-dialog.component';
import { InviteUserDialogComponent } from '../../components/invite-user-dialog/invite-user-dialog.component';
import { UserPermissionDialogComponent } from '../../components/user-permission-dialog/user-permission-dialog.component';
import { UsersComponent } from '../../components/users/users.component';
import { UsersStore } from '../../stores/users.store';

@UntilDestroy()
@Component({
  selector: 'ne-users-page',
  standalone: true,
  imports: [UsersComponent, LetDirective, MatDialogModule],
  template: `
    <ne-users
      [userDataTable]="usersTable()"
      [page]="tablePage()"
      [size]="tableSize()"
      [isLoading]="isLoading()"
      [usersLength]="usersLength()"
      (pageChange)="onPageChange($event)"
      (handlePermission)="onPermission($event)"
      (handleDisable)="onDisable($event)"
      (handleEnable)="onEnable($event)"
      (handleDelete)="onDelete($event)"
      (handleResendEmail)="onResendEmail($event)"
      (handleInviteUser)="onInviteUser()"
      (handleDisableMFA)="onDisableMFA($event)"
    ></ne-users>
  `,
  styleUrl: './users-page.component.scss',
  providers: [UsersStore],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersPageComponent {
  readonly usersStore = inject(UsersStore);
  usersTable = this.usersStore.userTable;
  tablePage = this.usersStore.page;
  tableSize = this.usersStore.size;
  usersLength = this.usersStore.usersLength;
  queryKey = this.usersStore.queryKey;
  isLoading = this.usersStore.isLoading;
  #dialog = inject(MatDialog);

  constructor() {
    effect(
      () => {
        if (this.isLoading() === USERS_LOADING.REFRESH_TABLE) {
          const size = this.tableSize();
          this.usersStore.queryUsersTableByPage({ size });
        }
      },
      { allowSignalWrites: true }
    );
  }

  onPermission = (user: User) => {
    let permissionDialogRef: any = this.#dialog.open(UserPermissionDialogComponent, {
      panelClass: 'med-dialog',
      disableClose: true,
      autoFocus: false,
      restoreFocus: false,
      data: { user, usersStore: this.usersStore }
    });

    permissionDialogRef
      .afterClosed()
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        permissionDialogRef = undefined;
      });
  };

  onDisable = (user: User) => {
    let activeDialogRef: any = this.#dialog.open(ActiveConfirmDialogComponent, {
      panelClass: 'med-dialog',
      disableClose: true,
      autoFocus: false,
      restoreFocus: false,
      data: { actionType: 'disable', user, usersStore: this.usersStore }
    });

    activeDialogRef
      .afterClosed()
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        activeDialogRef = undefined;
      });
  };

  onEnable = (user: User) => {
    let activeDialogRef: any = this.#dialog.open(ActiveConfirmDialogComponent, {
      panelClass: 'med-dialog',
      disableClose: true,
      autoFocus: false,
      restoreFocus: false,
      data: { actionType: 'enable', user, usersStore: this.usersStore }
    });

    activeDialogRef
      .afterClosed()
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        activeDialogRef = undefined;
      });
  };

  onDisableMFA = (user: User) => {
    let disableMfaDialogRef: any = this.#dialog.open(DisableMfaConfirmDialogComponent, {
      panelClass: 'med-dialog',
      disableClose: true,
      autoFocus: false,
      restoreFocus: false,
      data: { user, usersStore: this.usersStore }
    });

    disableMfaDialogRef
      .afterClosed()
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        disableMfaDialogRef = undefined;
      });
  };

  onDelete = (user: User) => {
    let deleteConfirmDialogRef: any = this.#dialog.open(DeleteConfirmDialogComponent, {
      panelClass: 'med-dialog',
      disableClose: true,
      autoFocus: false,
      restoreFocus: false,
      data: { actionType: 'enable', user, usersStore: this.usersStore }
    });

    deleteConfirmDialogRef
      .afterClosed()
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        deleteConfirmDialogRef = undefined;
      });
  };

  onInviteUser = () => {
    let inviteUserDialogRef: any = this.#dialog.open(InviteUserDialogComponent, {
      panelClass: 'med-dialog',
      disableClose: true,
      autoFocus: false,
      restoreFocus: false,
      data: { usersStore: this.usersStore }
    });

    inviteUserDialogRef
      .afterClosed()
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        inviteUserDialogRef = undefined;
      });
  };

  onResendEmail = (userId: number) => {
    this.usersStore.resendEmail(userId);
  };

  onPageChange = (event: TableQueryForUsers) => {
    this.usersStore.queryUsersTableByPage(event);
  };
}
