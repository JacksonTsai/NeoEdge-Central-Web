import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ne-delete-ot-device-confirm-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './delete-ot-device-confirm-dialog.component.html',
  styleUrl: './delete-ot-device-confirm-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeleteOtDeviceConfirmDialogComponent {}
