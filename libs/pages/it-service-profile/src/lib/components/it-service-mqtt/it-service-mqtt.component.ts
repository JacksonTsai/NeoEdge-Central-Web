import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ne-it-service-mqtt',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './it-service-mqtt.component.html',
  styleUrl: './it-service-mqtt.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItServiceMqttComponent {}
