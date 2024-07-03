import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { GATEWAY_STATUE, Gateway, TDashboardGatewayStatus } from '@neo-edge-web/models';
import { FormatCountPipe } from '@neo-edge-web/pipes';
import { DashboardGatewayLocationComponent, DashboardGatewayStatusComponent } from '../../components';

@Component({
  selector: 'ne-dashboard-gateway',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    FormatCountPipe,
    DashboardGatewayStatusComponent,
    DashboardGatewayLocationComponent
  ],
  templateUrl: './dashboard-gateway.component.html',
  styleUrl: './dashboard-gateway.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardGatewayComponent {
  gatewaysList = input<Gateway[]>([]);
  gatewayStatus = GATEWAY_STATUE;

  gatewaysStatusList = computed<TDashboardGatewayStatus>(() => {
    if (!this.gatewaysList().length) return null;
    const data = this.gatewaysList();
    const result = {};
    data.forEach((item: Gateway) => {
      const id = item.connectionStatus;
      const name = this.gatewayStatus[id];
      if (!result[name]) {
        result[name] = {
          id,
          name,
          list: []
        };
      }
      result[name].list.push(item);
    });
    return result;
  });
}
