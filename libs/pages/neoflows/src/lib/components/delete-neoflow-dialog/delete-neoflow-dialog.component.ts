import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule, UntypedFormControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { INeoflow } from '@neo-edge-web/models';
import { confirmNameValidator } from '@neo-edge-web/validators';

@Component({
  selector: 'ne-delete-neoflow-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './delete-neoflow-dialog.component.html',
  styleUrl: './delete-neoflow-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeleteNeoflowDialogComponent {
  readonly dialogRef = inject(MatDialogRef<DeleteNeoflowDialogComponent>);
  data = inject<{ neoflow: INeoflow; deleteFn: (v) => void }>(MAT_DIALOG_DATA);

  neoFlowNameCtrl = new UntypedFormControl('', [confirmNameValidator(this.data.neoflow.name)]);

  onDelete = () => {
    if (this.neoFlowNameCtrl.valid) {
      this.data.deleteFn({ neoflowId: this.data.neoflow.id });
    }
  };
}
