import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import * as AuthStore from '@neo-edge-web/auth-store';
import { UserService } from '@neo-edge-web/global-service';
import { IUserProfile, USER_INFO_LOADING } from '@neo-edge-web/models';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';
import { UserInfoComponent } from '../../components';
import { UserInfoStore } from '../../stores/user-profile.store';

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
      ></ne-user-info>
    </div>
  `,
  styleUrl: './user-profile.component.scss',
  providers: [UserInfoStore],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserProfileComponent {
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
}
