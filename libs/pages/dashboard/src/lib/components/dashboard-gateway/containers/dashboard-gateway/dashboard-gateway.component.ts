import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { DASHBOARD_GATEWAY_STATUE, GW_CURRENT_MODE, Gateway, TDashboardGatewayStatus } from '@neo-edge-web/models';
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
  dashboardGatewayStatus = DASHBOARD_GATEWAY_STATUE;
  gwCurrentMode = GW_CURRENT_MODE;

  gatewaysStatusList = computed<TDashboardGatewayStatus>(() => {
    if (!this.gatewaysList().length) return null;
    const data = this.gatewaysList();
    const result = {};
    data.forEach((item: Gateway) => {
      const { currentMode, connectionStatus } = item;
      let id: number;
      let name: string;

      if (this.gwCurrentMode.DETACH === currentMode) {
        name = 'Detach';
        id = this.dashboardGatewayStatus[name];
      } else {
        id = connectionStatus;
        name = this.dashboardGatewayStatus[connectionStatus];
      }

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
