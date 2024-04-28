import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PERMISSION_OPTIONS, RolesService } from '@neo-edge-web/global-service';
import { IRole, ROLES_LOADING, TableQueryForRoles } from '@neo-edge-web/models';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { map } from 'rxjs';
import { DeleteConfirmDialogComponent, EditRoleDialogComponent, RolesComponent } from '../../components';
import { RolesStore } from '../../stores/roles.store';

@UntilDestroy()
@Component({
  selector: 'ne-roles-page',
  standalone: true,
  imports: [CommonModule, RolesComponent],
  template: `
    <ne-roles
      [roleDataTable]="roleTable()"
      [page]="tablePage()"
      [size]="tableSize()"
      [isLoading]="isLoading()"
      [rolesLength]="rolesLength()"
      (pageChange)="onPageChange($event)"
      (handleEditRole)="onEditRole($event)"
      (handleDeleteRole)="onDeleteRole($event)"
    ></ne-roles>
  `,
  styleUrl: './roles-page.component.scss',
  providers: [RolesStore],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RolesPageComponent {
  readonly rolesStore = inject(RolesStore);
  readonly rolesService = inject(RolesService);

  roleTable = this.rolesStore.roleTable;
  tablePage = this.rolesStore.page;
  tableSize = this.rolesStore.size;
  rolesLength = this.rolesStore.rolesLength;
  queryKey = this.rolesStore.queryKey;
  isLoading = this.rolesStore.isLoading;
  #dialog = inject(MatDialog);
  #permissionOpts = inject(PERMISSION_OPTIONS);

  constructor() {
    effect(
      () => {
        if (this.isLoading() === ROLES_LOADING.REFRESH_TABLE) {
          this.rolesStore.queryRolesTableByPage({ size: this.tableSize() });
        }
      },
      { allowSignalWrites: true }
    );
  }

  onEditRole = (event?: { role: IRole | null }) => {
    if (event?.role) {
      this.rolesService
        .getRoleById$(event.role.id)
        .pipe(
          map((role) => {
            let editRoleDialogRef = this.#dialog.open(EditRoleDialogComponent, {
              panelClass: 'med-dialog',
              disableClose: true,
              autoFocus: false,
              restoreFocus: false,
              data: {
                roleId: event.role.id,
                role: role,
                rolesStore: this.rolesStore,
                permissionOpts: this.#permissionOpts.options
              }
            });

            editRoleDialogRef
              .afterClosed()
              .pipe(untilDestroyed(this))
              .subscribe(() => {
                editRoleDialogRef = undefined;
              });
          })
        )
        .subscribe();
    } else {
      let editRoleDialogRef = this.#dialog.open(EditRoleDialogComponent, {
        panelClass: 'med-dialog',
        disableClose: true,
        autoFocus: false,
        restoreFocus: false,
        data: { roleId: 0, role: null, rolesStore: this.rolesStore, permissionOpts: this.#permissionOpts.options }
      });

      editRoleDialogRef
        .afterClosed()
        .pipe(untilDestroyed(this))
        .subscribe(() => {
          editRoleDialogRef = undefined;
        });
    }
  };

  onDeleteRole = (role: IRole) => {
    let deleteConfirmDialogRef: any = this.#dialog.open(DeleteConfirmDialogComponent, {
      panelClass: 'med-dialog',
      disableClose: true,
      autoFocus: false,
      restoreFocus: false,
      data: { role, rolesStore: this.rolesStore }
    });

    deleteConfirmDialogRef
      .afterClosed()
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        deleteConfirmDialogRef = undefined;
      });
  };

  onPageChange = (event?: TableQueryForRoles) => {
    this.rolesStore.queryRolesTableByPage(event ?? {});
  };
}
