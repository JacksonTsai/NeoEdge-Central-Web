import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  OnInit,
  Output,
  effect,
  inject,
  input,
  signal
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { UserService } from '@neo-edge-web/global-service';
import {
  DATE_FORMAT,
  IGetProjectsResp,
  IGetUserProfileResp,
  IProjectByIdResp,
  IUserProfile,
  LANG,
  USER_INFO_LOADING
} from '@neo-edge-web/models';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { map } from 'rxjs';

@UntilDestroy()
@Component({
  selector: 'ne-user-info',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatInputModule,
    MatSelectModule
  ],
  templateUrl: './user-info.component.html',
  styleUrl: './user-info.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserInfoComponent implements OnInit {
  @Output() handleEditUserInfo = new EventEmitter<IUserProfile>();
  @Output() handleEditPassword = new EventEmitter<IGetUserProfileResp>();
  @Output() handleAddMfa = new EventEmitter<IGetUserProfileResp>();
  @Output() handleDisableMfa = new EventEmitter<IGetUserProfileResp>();
  #fb = inject(FormBuilder);
  userService = inject(UserService);
  isLoading = input<USER_INFO_LOADING>();
  userInfo = input<IGetUserProfileResp>();
  isEditMode = signal(false);

  form: UntypedFormGroup;
  langOpts = LANG;
  dateFormatOpts = DATE_FORMAT;
  idleTimeOpts = [
    { value: 0, label: 'Never' },
    { value: 5, label: '5 minutes' },
    { value: 10, label: '10 minutes' },
    { value: 20, label: '20 minutes' },
    { value: 30, label: '30 minutes' },
    { value: 60, label: '60 minutes' }
  ];
  projectsOpts = signal<IProjectByIdResp[]>([]);

  get dateTimeFormatCtrl() {
    return this.form.get('dateTimeFormat') as UntypedFormControl;
  }

  get defaultProjectIdCtrl() {
    return this.form.get('defaultProjectId') as UntypedFormControl;
  }

  get idleTimeoutCtrl() {
    return this.form.get('idleTimeout') as UntypedFormControl;
  }

  get isMfaEnableCtrl() {
    return this.form.get('isMfaEnable') as UntypedFormControl;
  }

  get languageCtrl() {
    return this.form.get('language') as UntypedFormControl;
  }

  get nameCtrl() {
    return this.form.get('name') as UntypedFormControl;
  }

  constructor() {
    effect(
      () => {
        if (this.userInfo() && this.isLoading() !== USER_INFO_LOADING.EDIT_PROFILE) {
          this.setFormValue(this.userInfo());
        }

        if (this.isLoading() === USER_INFO_LOADING.NONE) {
          this.changeEditMode(false);
        }
      },
      { allowSignalWrites: true }
    );
  }

  setFormValue = (userInfo: IGetUserProfileResp) => {
    this.form.setValue({
      dateTimeFormat: userInfo?.dateTimeFormat ?? '',
      defaultProjectId: userInfo?.defaultProjectId ?? '',
      idleTimeout: userInfo?.idleTimeout ?? 0,
      isMfaEnable: userInfo?.isMfaEnable ?? 0,
      language: userInfo?.language ?? '',
      name: userInfo?.name ?? ''
    });
  };

  changeEditMode = (isEdit: boolean) => {
    this.isEditMode.set(isEdit);
    if (isEdit) {
      this.dateTimeFormatCtrl.enable();
      this.defaultProjectIdCtrl.enable();
      this.idleTimeoutCtrl.enable();
      this.isMfaEnableCtrl.enable();
      this.languageCtrl.enable();
      this.nameCtrl.enable();
    } else {
      this.dateTimeFormatCtrl.disable();
      this.defaultProjectIdCtrl.disable();
      this.idleTimeoutCtrl.disable();
      this.isMfaEnableCtrl.disable();
      this.languageCtrl.disable();
      this.nameCtrl.disable();
    }
  };

  onCancelEdit = () => {
    this.changeEditMode(false);
    this.setFormValue(this.userInfo());
    this.form.markAsPristine();
  };

  onEdit = () => {
    this.changeEditMode(true);
  };

  onSave = () => {
    const userProfileReq: IUserProfile = {
      dateTimeFormat: this.dateTimeFormatCtrl.value,
      defaultProjectId: this.defaultProjectIdCtrl.value,
      idleTimeout: this.idleTimeoutCtrl.value,
      isMfaEnable: this.isMfaEnableCtrl.value,
      language: this.languageCtrl.value,
      name: (this.nameCtrl.value as string).trim()
    };

    this.handleEditUserInfo.emit(userProfileReq);
  };

  onEditPassword = () => {
    this.handleEditPassword.emit(this.userInfo());
  };

  onAddMfa = () => {
    this.handleAddMfa.emit(this.userInfo());
  };

  onDisableMfa = () => {
    this.handleDisableMfa.emit(this.userInfo());
  };

  ngOnInit(): void {
    this.form = this.#fb.group({
      dateTimeFormat: [{ value: this.userInfo()?.dateTimeFormat ?? '', disabled: true }, [Validators.required]],
      defaultProjectId: [{ value: this.userInfo()?.defaultProjectId ?? '', disabled: true }, [Validators.required]],
      idleTimeout: [{ value: this.userInfo()?.idleTimeout ?? '', disabled: true }, [Validators.required]],
      isMfaEnable: [{ value: this.userInfo()?.isMfaEnable ?? 0, disabled: true }, [Validators.required]],
      language: [{ value: this.userInfo()?.language ?? '', disabled: true }, [Validators.required]],
      name: [{ value: this.userInfo()?.name ?? '', disabled: true }, [Validators.required]]
    });

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
