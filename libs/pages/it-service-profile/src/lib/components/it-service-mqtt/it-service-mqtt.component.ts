import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ISupportAppsWithVersion } from '@neo-edge-web/models';

@Component({
  selector: 'ne-it-service-mqtt',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './it-service-mqtt.component.html',
  styleUrl: './it-service-mqtt.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItServiceMqttComponent {
  appSettings = input<ISupportAppsWithVersion>();
}
