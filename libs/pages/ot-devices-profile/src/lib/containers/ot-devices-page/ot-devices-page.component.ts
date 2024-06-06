import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ne-ot-devices-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ot-devices-page.component.html',
  styleUrl: './ot-devices-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OtDevicesPageComponent {}
