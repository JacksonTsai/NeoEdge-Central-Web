import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { IEventDoc, ILiveMonitorEvent } from '@neo-edge-web/models';
import { dateTimeFormatPipe } from '@neo-edge-web/pipes';

const EVENT_DATA_MOCK: ILiveMonitorEvent[] = [
  {
    timestamp: 4870848654,
    eventId: 2401,
    eventData: { gatewayEnkey: '4F3F1E87-B666-5910-BBAF-EDED4F07BDD5', gatewayName: 'Moxa-Dev-01', appName: 'APP_NAME' }
  },
  {
    timestamp: 4870848654,
    eventId: 2401,
    eventData: { gatewayEnkey: '4F3F1E87-B666-5910-BBAF-EDED4F07BDD5', gatewayName: 'Moxa-Dev-01', appName: 'APP_NAME' }
  },
  {
    timestamp: 4870848654,
    eventId: 2401,
    eventData: { gatewayEnkey: '4F3F1E87-B666-5910-BBAF-EDED4F07BDD5', gatewayName: 'Moxa-Dev-01', appName: 'APP_NAME' }
  },
  {
    timestamp: 4870848654,
    eventId: 2401,
    eventData: { gatewayEnkey: '4F3F1E87-B666-5910-BBAF-EDED4F07BDD5', gatewayName: 'Moxa-Dev-01', appName: 'APP_NAME' }
  }
];

@Component({
  selector: 'ne-live-monitor-log',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatExpansionModule, dateTimeFormatPipe],
  templateUrl: './live-monitor-log.component.html',
  styleUrl: './live-monitor-log.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LiveMonitorLogComponent {
  eventDoc = input<IEventDoc>(null);
  readonly panelOpenState = signal(false);
  eventDataMock = EVENT_DATA_MOCK;
}
