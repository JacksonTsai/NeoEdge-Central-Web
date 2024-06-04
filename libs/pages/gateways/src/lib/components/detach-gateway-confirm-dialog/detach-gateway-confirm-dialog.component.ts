import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AbstractControl, ReactiveFormsModule, UntypedFormControl, ValidationErrors, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { GW_RUNNING_MODE } from '@neo-edge-web/models';
import { GatewayDetailStore } from '../../stores/gateway-detail.store';

@Component({
  selector: 'ne-delete-gateway-confirm',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule],
  templateUrl: './detach-gateway-confirm-dialog.component.html',
  styleUrl: './detach-gateway-confirm-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DetachGatewayConfirmDialogComponent {
  dialogRef!: MatDialogRef<DetachGatewayConfirmDialogComponent>;
  data = inject<{ gwDetailStore: GatewayDetailStore; gatewayName: string }>(MAT_DIALOG_DATA);

  get gatewayName() {
    return this.data?.gatewayName ?? '-';
  }

  incorrectGatewayName = (control: AbstractControl): ValidationErrors | null => {
    return control.value === this.data.gatewayName ? null : { incorrectName: true };
  };

  gatewayNameCtrl = new UntypedFormControl('', [Validators.required, this.incorrectGatewayName]);

  onDetach = () => {
    if (this.gatewayNameCtrl.valid && this.data.gatewayName) {
      this.data.gwDetailStore.switchRunningMode({ mode: GW_RUNNING_MODE.Detach, name: this.data.gatewayName });
    }
  };
}
