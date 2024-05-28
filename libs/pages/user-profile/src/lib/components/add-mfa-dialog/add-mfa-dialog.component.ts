import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, OnInit, inject, viewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormField, MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormService, UserService } from '@neo-edge-web/global-service';
import { IGetUserProfileResp } from '@neo-edge-web/models';
import { UntilDestroy } from '@ngneat/until-destroy';
import QRCode from 'qrcode';
import { RecommendMfaAppComponent } from '../recommend-mfa-app/recommend-mfa-app.component';

@UntilDestroy()
@Component({
  selector: 'ne-add-mfa-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatButtonModule, MatInputModule, MatFormField],
  templateUrl: './add-mfa-dialog.component.html',
  styleUrl: './add-mfa-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddMfaDialogComponent implements OnInit {
  data = inject<{ userInfo: IGetUserProfileResp }>(MAT_DIALOG_DATA);
  #fb = inject(FormBuilder);
  #snackBar = inject(MatSnackBar);
  #bottomSheet = inject(MatBottomSheet);
  formService = inject(FormService);
  userService = inject(UserService);
  form: UntypedFormGroup;
  canvas = viewChild.required<ElementRef>('canvas');

  get codeCtrl() {
    return this.form.get('code') as UntypedFormControl;
  }

  openRecommandApp() {
    this.#bottomSheet.open(RecommendMfaAppComponent);
  }

  generateQRCode() {
    // TODO 串接 MFA secret key API
    const otpauthURI = `otpauth://totp/ExampleApp:${this.data.userInfo?.account}?secret=JBSWY3DPEHPK3PXP&issuer=ExampleApp`;

    if (!this.canvas()) {
      return;
    }

    QRCode.toCanvas(this.canvas()?.nativeElement, otpauthURI, (err) => {
      if (err) {
        console.error('Error generating QR code', err);
      }
    });
  }

  onKeypress(event: KeyboardEvent): void {
    const pattern = /[0-9]/;
    const inputElement = event.target as HTMLInputElement;
    if (!pattern.test(event.key) || inputElement.value.length >= 6) {
      event.preventDefault();
    }
  }

  addMfa = () => {
    // TODO 串接 MFA 送出 API
    // const payload = {
    //   code: this.codeCtrl.value
    // };
    // this.userService
    //   .addMfa$({ ...payload })
    //   .pipe(
    //     untilDestroyed(this),
    //     catchError((err) => {
    //       this.#snackBar.open('Set MFA failed', 'X', {
    //         horizontalPosition: 'end',
    //         verticalPosition: 'bottom',
    //         duration: 5000
    //       })
    //     })
    //   )
    //   .subscribe();
  };

  onSubmit = () => {
    if (this.form.invalid) {
      return;
    }
    this.addMfa();
  };

  ngOnInit() {
    this.form = this.#fb.group({
      code: [null, [Validators.required]]
    });
    this.generateQRCode();
  }
}
