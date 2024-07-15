import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, UntypedFormControl, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { bTypeValidator, whitespaceValidator } from '@neo-edge-web/validators';

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
    type: 'ot' | 'it' | 'neoflow';
    copyFrom: { displayName: string; id: number };
    copyFn: ({ profileId, name }: { profileId: number; name: string }) => void;
  }>(MAT_DIALOG_DATA);

  get nameCtrl() {
    return this.form.get('name') as UntypedFormControl;
  }

  form = new FormGroup({
    name: new FormControl('', [Validators.required, whitespaceValidator, bTypeValidator])
  });

  onCopy = () => {
    this.data.copyFn({ profileId: this.data.copyFrom.id, name: this.nameCtrl.value });
  };

  onClose = () => {
    this.dialogRef.close();
  };
}
