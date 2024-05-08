import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router, RouterModule } from '@angular/router';
import * as AuthStore from '@neo-edge-web/global-store';
import { Store } from '@ngrx/store';
@Component({
  selector: 'ne-login',
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
    MatProgressBarModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements OnInit {
  #globalStore = inject(Store);
  #router = inject(Router);
  #fb = inject(FormBuilder);

  spinner = false;

  rememberAccount = localStorage.getItem('account');
  form!: FormGroup;
  isTogglePwd = signal(true);
  rememberMeCtrl = new FormControl(false);

  get accountCtrl() {
    return this.form.get('account') as FormControl;
  }

  get passwordCtrl() {
    return this.form.get('password') as FormControl;
  }

  togglePwd = () => {
    this.isTogglePwd.set(!this.isTogglePwd());
  };

  singIn = () => {
    if (this.form.invalid) {
      return;
    }
    if (this.rememberMeCtrl.value) {
      localStorage.setItem('account', this.accountCtrl.value);
    } else {
      localStorage.removeItem('account');
    }

    this.#globalStore.dispatch(
      AuthStore.loginAction({
        loginReq: {
          account: this.accountCtrl.value,
          password: this.passwordCtrl.value
        }
      })
    );
  };

  singInWithAzure = () => {
    // TODO  Sing In With Azure
  };

  ngOnInit() {
    this.rememberMeCtrl.setValue(this.rememberAccount ? true : false);
    this.form = this.#fb.group({
      account: [this.rememberAccount ?? '', Validators.required],
      password: ['', Validators.required]
    });
  }
}
