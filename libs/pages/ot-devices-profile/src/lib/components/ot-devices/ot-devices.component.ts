import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ne-ot-devices',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ot-devices.component.html',
  styleUrl: './ot-devices.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OtDevicesComponent {}
