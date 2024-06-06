import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ne-copy-ot-device-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './copy-ot-device-dialog.component.html',
  styleUrl: './copy-ot-device-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CopyOtDeviceDialogComponent {}
