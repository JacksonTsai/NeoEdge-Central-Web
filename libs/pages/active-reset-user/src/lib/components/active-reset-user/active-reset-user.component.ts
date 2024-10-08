import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router, RouterModule } from '@angular/router';
import { AuthService, FormService, ValidatorsService } from '@neo-edge-web/global-services';
import { RouterStoreService } from '@neo-edge-web/global-stores';
import { ISetPasswordReq } from '@neo-edge-web/models';
import { ENV_VARIABLE } from '@neo-edge-web/neoedge-central-web/environment';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { EMPTY, catchError, map, switchMap, take, tap } from 'rxjs';
import { ACTION_RESULT, ACTIVE_RESET_ACTION, IPageState } from '../../models/active-reset-user.model';

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
    MatProgressSpinnerModule,
    MatProgressBarModule,
    HttpClientModule
  ],
  templateUrl: './active-reset-user.component.html',
  styleUrl: './active-reset-user.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActiveResetUserComponent implements OnInit {
  envVariable = inject(ENV_VARIABLE);
  routerStoreService = inject(RouterStoreService);
  #globalStore = inject(Store);
  #router = inject(Router);
  #fb = inject(FormBuilder);
  #cd = inject(ChangeDetectorRef);
  authService = inject(AuthService);
  formService = inject(FormService);
  validatorsService = inject(ValidatorsService);
  form!: UntypedFormGroup;
  activeResetAction = ACTIVE_RESET_ACTION;
  actionResult = ACTION_RESULT;
  httpService = inject(HttpClient);

  pageState = signal<IPageState>({
    action: ACTIVE_RESET_ACTION.NONE,
    actionResult: ACTION_RESULT.NONE,
    isTokenInvalid: false
  });

  get accountCtrl() {
    return this.form.get('account') as UntypedFormControl;
  }

  get passwordCtrl() {
    return this.form.get('password') as UntypedFormControl;
  }

  get confirmPasswordCtrl() {
    return this.form.get('confirmPassword') as UntypedFormControl;
  }

  get verifyTokenCtrl() {
    return this.form.get('verifyToken') as UntypedFormControl;
  }

  get eulaXCtrl() {
    return this.form.get('eulaX') as UntypedFormControl;
  }

  get eulaCentralCtrl() {
    return this.form.get('eulaCentral') as UntypedFormControl;
  }

  activeResetUser = () => {
    const payload: ISetPasswordReq = {
      account: this.accountCtrl.value ?? '',
      password: this.passwordCtrl.value,
      eulaVersion: this.envVariable.eulaVersion,
      verifyToken: this.verifyTokenCtrl.value
    };
    if (ACTIVE_RESET_ACTION.FORGOT_PASSWORD === this.pageState().action) {
      delete payload.eulaVersion;
    }

    this.authService
      .setPassword$({
        ...payload
      })
      .pipe(
        take(1),
        untilDestroyed(this),
        tap((d) => {
          this.pageState.update((state) => ({
            ...state,
            actionResult: ACTION_RESULT.SUCCESS
          }));
        }),
        catchError(() => {
          this.pageState.update((state) => ({
            ...state,
            actionResult: ACTION_RESULT.FAILURE
          }));
          this.#cd.markForCheck();
          return EMPTY;
        })
      )
      .subscribe();
  };

  onSubmit = () => {
    if (
      this.form.invalid ||
      !this.eulaXCtrl.value ||
      !this.eulaCentralCtrl.value ||
      this.confirmPasswordCtrl.hasError('isNotMatch')
    ) {
      return;
    }
    this.activeResetUser();
  };

  enableUserField = (isEnable) => {
    if (isEnable) {
      this.passwordCtrl.enable();
      this.confirmPasswordCtrl.enable();
      this.eulaXCtrl.enable();
      this.eulaCentralCtrl.enable();
    } else {
      this.passwordCtrl.disable();
      this.confirmPasswordCtrl.disable();
      this.eulaXCtrl.disable();
      this.eulaCentralCtrl.disable();
    }
  };

  activeResetUserAction = () => {
    this.routerStoreService.getQueryParams$
      .pipe(
        map(({ token }: { token: string }) => {
          if (!token) {
            this.enableUserField(false);
            this.pageState.update((state) => ({
              ...state,
              isTokenInvalid: true
            }));
            throw 'Incorrect token';
          }
          this.verifyTokenCtrl.setValue(token);
          return token;
        }),
        switchMap((token) => {
          return this.authService.verifyInitToken$({ verifyToken: token }).pipe(
            tap(({ account }) => {
              this.accountCtrl.setValue(account);
              this.enableUserField(true);
              this.#cd.markForCheck();
            })
          );
        }),
        untilDestroyed(this),
        catchError((err) => {
          this.pageState.update((state) => ({
            ...state,
            isTokenInvalid: true
          }));
          return EMPTY;
        })
      )
      .subscribe();
  };

  ngOnInit() {
    this.form = this.#fb.group(
      {
        account: ['', Validators.required],
        password: [{ value: '', disabled: true }, [Validators.required, this.validatorsService.passwordValidator()]],
        confirmPassword: [
          { value: '', disabled: true },
          [Validators.required, this.validatorsService.matchValidator('password')]
        ],
        eulaX: [{ value: false, disabled: true }],
        eulaCentral: [{ value: false, disabled: true }],
        eulaVersion: [this.envVariable.eulaVersion],
        verifyToken: ['', Validators.required]
      },
      { validator: [this.validatorsService.match2Field('password', 'confirmPassword')] }
    );

    this.routerStoreService.getDataFromRouter$
      .pipe(
        take(1),
        untilDestroyed(this),
        map(({ trigger }) => {
          if ('active-user' === trigger) {
            this.pageState.update((state) => ({
              ...state,
              action: ACTIVE_RESET_ACTION.ACTIVE_USER
            }));
          }
          if ('forget-password' === trigger) {
            this.pageState.update((state) => ({
              ...state,

              action: ACTIVE_RESET_ACTION.FORGOT_PASSWORD
            }));
            this.eulaXCtrl.setValue(true);
            this.eulaCentralCtrl.setValue(true);
          }

          this.activeResetUserAction();
        })
      )
      .subscribe();
  }
}
