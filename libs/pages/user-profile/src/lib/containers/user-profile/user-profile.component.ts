import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import * as AuthStore from '@neo-edge-web/auth-store';
import { UserService } from '@neo-edge-web/global-service';
import { IGetUserProfileResp, IUserProfile, USER_INFO_LOADING } from '@neo-edge-web/models';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';
import { UserInfoComponent } from '../../components';
import { AddMfaDialogComponent } from '../../components/add-mfa-dialog/add-mfa-dialog.component';
import { EditPasswordDialogComponent } from '../../components/edit-password-dialog/edit-password-dialog.component';

@UntilDestroy()
@Component({
  selector: 'ne-user-profile',
  standalone: true,
  imports: [CommonModule, UserInfoComponent],
  template: `
    <div *ngIf="userInfo$ | async as vm" class="user-info-container">
      <ne-user-info
        [isLoading]="isLoading()"
        [userInfo]="vm?.userProfile"
        (handleEditUserInfo)="onEditUserProfile($event)"
        (handleEditPassword)="onEditPassword($event)"
        (handleAddMfa)="onAddMfa()"
      ></ne-user-info>
    </div>
  `,
  styleUrl: './user-profile.component.scss',
  providers: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserProfileComponent {
  #dialog = inject(MatDialog);
  #globalStore = inject(Store);
  userService = inject(UserService);
  userInfo$ = this.#globalStore.select(AuthStore.selectUserProfile);
  isLoading = signal<USER_INFO_LOADING>(USER_INFO_LOADING.NONE);

  onEditUserProfile = (event: IUserProfile) => {
    this.isLoading.set(USER_INFO_LOADING.EDIT_PROFILE);
    this.userService
      .editUserProfile$(event)
      .pipe(
        untilDestroyed(this),
        map(() => {
          this.#globalStore.dispatch(AuthStore.userProfileAction());
          this.isLoading.set(USER_INFO_LOADING.NONE);
        })
      )
      .subscribe();
  };

  onEditPassword = (userInfo: IGetUserProfileResp) => {
    let editPasswordDialogRef = this.#dialog.open(EditPasswordDialogComponent, {
      panelClass: 'med-dialog',
      disableClose: false,
      autoFocus: true,
      restoreFocus: false,
      data: {
        userInfo
      }
    });

    editPasswordDialogRef
      .afterClosed()
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        editPasswordDialogRef = undefined;
      });
  };

  onAddMfa = () => {
    let addMfaDialogRef = this.#dialog.open(AddMfaDialogComponent, {
      panelClass: 'med-dialog',
      disableClose: false,
      autoFocus: false,
      restoreFocus: false,
      data: {}
    });

    addMfaDialogRef
      .afterClosed()
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        addMfaDialogRef = undefined;
      });
  };
}
