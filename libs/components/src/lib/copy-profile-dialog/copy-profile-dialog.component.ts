import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { whitespaceValidator } from '@neo-edge-web/validators';

@Component({
  selector: 'ne-copy-profile-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatOptionModule,
    MatSelectModule
  ],
  templateUrl: './copy-profile-dialog.component.html',
  styleUrl: './copy-profile-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CopyProfileDialogComponent {
  dialogRef!: MatDialogRef<CopyProfileDialogComponent>;
  data = inject<{
    type: 'ot' | 'it';
    fromCopyOpts: { displayName: string; id: number }[];
    deleteFn: (d: any) => void;
  }>(MAT_DIALOG_DATA);

  get nameCtrl() {
    return this.form.get('name') as FormControl;
  }

  get copyFromCtrl() {
    return this.form.get('copyFrom') as FormControl;
  }

  form = new FormGroup({
    name: new FormControl('', [Validators.required, whitespaceValidator]),
    copyFrom: new FormControl('', [Validators.required])
  });

  onCopy = () => {
    this.data.deleteFn(this.form.value);
  };

  onClose = () => {
    this.dialogRef.close();
  };
}
