import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, UntypedFormControl, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';
import { AuthService } from '@neo-edge-web/global-services';
import { UntilDestroy } from '@ngneat/until-destroy';
import { EMPTY, catchError, tap } from 'rxjs';
import {
  IRequestNewPasswordState,
  REQUEST_PASSWORD_ACTION,
  REQUEST_PASSWORD_RESULT
} from '../../models/request-new-password.model';

@UntilDestroy()
@Component({
  standalone: true,
  imports: [
    MatCardModule,
    MatInputModule,
    MatIconModule,
    MatFormFieldModule,
    MatButtonModule,
    MatCheckboxModule,
    RouterModule,
    ReactiveFormsModule,
    MatCardModule
  ],
  templateUrl: './request-new-password.component.html',
  styleUrl: './request-new-password.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RequestNewPasswordComponent {
  authService = inject(AuthService);
  accountCtrl = new UntypedFormControl('', [Validators.required, Validators.email]);

  requestPasswordAction = REQUEST_PASSWORD_ACTION;
  requestPasswordResult = REQUEST_PASSWORD_RESULT;

  pageState = signal<IRequestNewPasswordState>({
    action: REQUEST_PASSWORD_ACTION.NONE,
    actionResult: REQUEST_PASSWORD_RESULT.NONE
  });

  onForgetPassword = () => {
    if (this.accountCtrl.valid) {
      this.authService
        .forgetPassword$({ account: this.accountCtrl.value })
        .pipe(
          tap(() => {
            this.pageState.update((state) => {
              return {
                ...state,
                action: REQUEST_PASSWORD_ACTION.REQUEST_NEW_PASSWORD,
                actionResult: REQUEST_PASSWORD_RESULT.SUCCESS
              };
            });
          }),
          catchError(() => {
            this.pageState.update((state) => {
              return {
                ...state,
                action: REQUEST_PASSWORD_ACTION.REQUEST_NEW_PASSWORD,
                actionResult: REQUEST_PASSWORD_RESULT.FAILURE
              };
            });
            return EMPTY;
          })
        )
        .subscribe();
    }
  };
}
