import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

interface INeoFlowMock {
  gateway_id: number;
  message_id: number;
  device_id: number;
  app_id: number;
  message_name: string;
  message_version: number;
  gateway_version: number;
  action: string[];
}

const NEOFLOW_MOCK = {
  gateway_id: 134,
  message_id: 64,
  device_id: 145,
  app_id: 33,
  message_name: 'TEXOL-Sensor',
  message_version: 33,
  gateway_version: 33,
  action: ['View', 'Deploy', 'Withdraw', 'Live Monitor', 'Stop', 'Setting']
};

@Component({
  selector: 'ne-gateway-neoflow',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './gateway-neoflow.component.html',
  styleUrl: './gateway-neoflow.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GatewayNeoflowComponent {
  @Output() handleOpenLiveMonitor = new EventEmitter<INeoFlowMock>();

  openLiveMonitor = (): void => {
    this.handleOpenLiveMonitor.emit(NEOFLOW_MOCK);
  };
}
