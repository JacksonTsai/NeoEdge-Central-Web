import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import * as AuthStore from '@neo-edge-web/auth-store';
import { UserService } from '@neo-edge-web/global-service';
import {
  IGetProjectsResp,
  IGetUserProfileResp,
  IProjectByIdResp,
  IUserProfile,
  USER_INFO_LOADING
} from '@neo-edge-web/models';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';
import { UserInfoComponent } from '../../components';
import { AddMfaDialogComponent } from '../../components/add-mfa-dialog/add-mfa-dialog.component';
import { AuthenticationCodeComponent } from '../../components/authentication-code/authentication-code.component';
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
        [projectsOpts]="projectsOpts()"
        (handleEditUserInfo)="onEditUserProfile($event)"
        (handleEditPassword)="onEditPassword($event)"
        (handleAddMfa)="onAddMfa($event)"
        (handleDisableMfa)="onDisableMfa($event)"
      ></ne-user-info>
    </div>
  `,
  styleUrl: './user-profile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserProfileComponent implements OnInit {
  #dialog = inject(MatDialog);
  #globalStore = inject(Store);
  userService = inject(UserService);
  userInfo$ = this.#globalStore.select(AuthStore.selectUserProfile);
  projectsOpts = signal<IProjectByIdResp[]>([]);
  isLoading = signal<USER_INFO_LOADING>(USER_INFO_LOADING.NONE);

  updateUserProfile = (userInfo: IUserProfile) => {
    this.userService
      .editUserProfile$(userInfo)
      .pipe(
        untilDestroyed(this),
        map(() => {
          this.#globalStore.dispatch(AuthStore.userProfileAction());
          this.isLoading.set(USER_INFO_LOADING.NONE);
        })
      )
      .subscribe();
  };

  onEditUserProfile = (event: IUserProfile) => {
    this.isLoading.set(USER_INFO_LOADING.EDIT_PROFILE);
    this.updateUserProfile(event);
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

  onAddMfa = (userInfo: IGetUserProfileResp) => {
    let addMfaDialogRef = this.#dialog.open(AddMfaDialogComponent, {
      panelClass: 'med-dialog',
      disableClose: false,
      autoFocus: false,
      restoreFocus: false,
      data: {
        userInfo
      }
    });

    addMfaDialogRef?.componentInstance.handleSubmitMfaCodeSuccess.pipe(untilDestroyed(this)).subscribe((data) => {
      const payload = { ...data, isMfaEnable: 1 };
      this.updateUserProfile(payload);
      addMfaDialogRef.close();
    });

    addMfaDialogRef
      .afterClosed()
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        addMfaDialogRef = undefined;
      });
  };

  onDisableMfa = (userInfo: IGetUserProfileResp) => {
    let confirmMfaDialogRef = this.#dialog.open(AuthenticationCodeComponent, {
      panelClass: 'med-dialog',
      disableClose: false,
      autoFocus: true,
      restoreFocus: false,
      data: {
        userInfo
      }
    });

    confirmMfaDialogRef?.componentInstance.handleValidMfaCode.pipe(untilDestroyed(this)).subscribe((data) => {
      const payload = { ...data, isMfaEnable: 0 };
      this.updateUserProfile(payload);
      confirmMfaDialogRef.close();
    });

    confirmMfaDialogRef
      .afterClosed()
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        confirmMfaDialogRef = undefined;
      });
  };

  ngOnInit(): void {
    this.userService
      .userProjects$()
      .pipe(
        untilDestroyed(this),
        map((userProjects: IGetProjectsResp) => {
          this.projectsOpts.set(userProjects?.projects);
        })
      )
      .subscribe();
  }
}
