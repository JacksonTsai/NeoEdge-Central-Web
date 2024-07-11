import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AbstractControl, ReactiveFormsModule, UntypedFormControl, ValidationErrors, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { GatewayDetailStore } from '../../stores/gateway-detail.store';

@Component({
  selector: 'ne-delete-gateway-confirm',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule],
  templateUrl: './delete-gateway-confirm-dialog.component.html',
  styleUrl: './delete-gateway-confirm-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeleteGatewayConfirmDialogComponent {
  dialogRef!: MatDialogRef<DeleteGatewayConfirmDialogComponent>;
  data = inject<{ gwDetailStore: GatewayDetailStore; gatewayName: string; isConnectedOrWaiting: boolean }>(
    MAT_DIALOG_DATA
  );

  get gatewayName() {
    return this.data?.gatewayName ?? '-';
  }

  incorrectGatewayName = (control: AbstractControl): ValidationErrors | null => {
    return control.value === this.data.gatewayName ? null : { incorrectName: true };
  };

  gatewayNameCtrl = new UntypedFormControl('', [Validators.required, this.incorrectGatewayName]);

  onDeleteGateway = () => {
    if (this.gatewayNameCtrl.valid && this.data.gatewayName) {
      this.data.gwDetailStore.deleteGateway({ name: this.data.gatewayName });
    }
  };
}
