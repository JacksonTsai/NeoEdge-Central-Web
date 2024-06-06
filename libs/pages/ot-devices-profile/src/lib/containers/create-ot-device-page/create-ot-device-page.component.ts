import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ne-create-ot-device-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './create-ot-device-page.component.html',
  styleUrl: './create-ot-device-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateOtDevicePageComponent {}
