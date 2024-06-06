import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ne-create-ot-device',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './create-ot-device.component.html',
  styleUrl: './create-ot-device.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateOtDeviceComponent {}
