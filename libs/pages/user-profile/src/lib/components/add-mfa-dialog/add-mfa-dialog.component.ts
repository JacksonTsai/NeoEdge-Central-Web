import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormField, MatInputModule } from '@angular/material/input';
import { FormService } from '@neo-edge-web/global-service';

@Component({
  selector: 'ne-add-mfa-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatButtonModule, MatInputModule, MatFormField],
  templateUrl: './add-mfa-dialog.component.html',
  styleUrl: './add-mfa-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddMfaDialogComponent implements OnInit {
  #fb = inject(FormBuilder);
  formService = inject(FormService);
  form: UntypedFormGroup;

  get codeCtrl() {
    return this.form.get('code') as UntypedFormControl;
  }

  onKeypress(event: KeyboardEvent): void {
    const pattern = /[0-9]/;
    const inputElement = event.target as HTMLInputElement;
    if (!pattern.test(event.key) || inputElement.value.length >= 6) {
      event.preventDefault();
    }
  }

  ngOnInit() {
    this.form = this.#fb.group({
      code: [null, [Validators.required]]
    });
  }
}
