import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { SafePipe } from '@neo-edge-web/directives';
import {
  BOOLEAN_STATUS,
  GATEWAY_SSH_MODE,
  GATEWAY_STATUE,
  GW_CURRENT_MODE,
  TGatewayStatusInfo
} from '@neo-edge-web/models';
import { datetimeFormat } from '@neo-edge-web/utils';

@Component({
  selector: 'ne-gateway-status-info',
  standalone: true,
  imports: [CommonModule, MatIconModule, SafePipe, MatMenuModule, MatButtonModule],
  templateUrl: './gateway-status-info.component.html',
  styleUrl: './gateway-status-info.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GatewayStatusInfoComponent {
  gatewayStatusInfo = input<TGatewayStatusInfo | null>(null);
  gwCurrentMode = GW_CURRENT_MODE;
  gwSshMode = GATEWAY_SSH_MODE;
  gwStatus = GATEWAY_STATUE;
  booleanStatus = BOOLEAN_STATUS;

  logo = computed(() => {
    if (!this.gatewayStatusInfo()) {
      return '';
    }
    if (!this.gatewayStatusInfo().ipcVendorName || !this.gatewayStatusInfo().ipcModelSeriesName) {
      return '/assets/images/default_gateway.png';
    }

    return (
      `${this.gatewayStatusInfo().gatewayIconPath}?timeptemp=${Date.now()}` ||
      `/assets/images/default_${this.gatewayStatusInfo().ipcVendorName.toLowerCase()}-${this.gatewayStatusInfo().ipcModelSeriesName}.png`
    );
  });

  gatewayProfileUpdateTime = computed(() => {
    return this.gatewayStatusInfo().gatewaySystemInfoUpdateAt > 0
      ? this.getDatetimeFormat(this.gatewayStatusInfo().gatewaySystemInfoUpdateAt)
      : '-';
  });

  isSecurity = computed(() => {
    return this.gatewayStatusInfo().sshMode === GATEWAY_SSH_MODE.FALSE &&
      this.gatewayStatusInfo().tpmEnabled === BOOLEAN_STATUS.TRUE
      ? true
      : false;
  });

  getDatetimeFormat = (timestamp: number) => {
    return datetimeFormat(timestamp);
  };
}
