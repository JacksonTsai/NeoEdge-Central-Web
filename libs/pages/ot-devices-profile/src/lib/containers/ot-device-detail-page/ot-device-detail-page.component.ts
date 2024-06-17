import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ne-ot-device-detail-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ot-device-detail-page.component.html',
  styleUrl: './ot-device-detail-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OtDeviceDetailPageComponent {}
