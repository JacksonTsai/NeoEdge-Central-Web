import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule, UntypedFormControl, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ValidatorsService } from '@neo-edge-web/global-services';
import { IItService } from '@neo-edge-web/models';
import { ItServiceDetailStore } from '../../stores/it-service-detail.store';

@Component({
  selector: 'ne-delete-it-service-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule, MatDialogModule, MatFormFieldModule, MatInputModule],
  templateUrl: './delete-it-service-dialog.component.html',
  styleUrl: './delete-it-service-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeleteItServiceDialogComponent {
  data = inject<{ itService: IItService; itServiceDetailStore: ItServiceDetailStore }>(MAT_DIALOG_DATA);
  validatorsService = inject(ValidatorsService);

  nameCtrl = new UntypedFormControl('', [
    Validators.required,
    this.validatorsService.matchStr(this.data?.itService.name)
  ]);

  onDelete = (): void => {
    if (this.nameCtrl.valid) {
      this.data.itServiceDetailStore.deleteItService({
        profileId: this.data.itService.id,
        name: this.data.itService.name
      });
    }
  };
}
