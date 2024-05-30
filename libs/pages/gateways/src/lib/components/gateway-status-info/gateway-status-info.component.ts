import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Output, computed, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { SafePipe } from '@neo-edge-web/directives';
import {
  BOOLEAN_STATUS,
  GATEWAY_SSH_MODE,
  GATEWAY_STATUE,
  GW_CURRENT_MODE,
  GW_RUNNING_MODE,
  PERMISSION,
  TGatewayStatusInfo
} from '@neo-edge-web/models';
import { datetimeFormat } from '@neo-edge-web/utils';
import { NgxPermissionsModule } from 'ngx-permissions';

@Component({
  selector: 'ne-gateway-status-info',
  standalone: true,
  imports: [CommonModule, MatIconModule, SafePipe, MatMenuModule, MatButtonModule, NgxPermissionsModule],

  templateUrl: './gateway-status-info.component.html',
  styleUrl: './gateway-status-info.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GatewayStatusInfoComponent {
  @Output() handelFetchGwHwInfo = new EventEmitter();
  @Output() handleSwitchRunningMode = new EventEmitter<{ mode: GW_RUNNING_MODE }>();
  @Output() handleDetachMode = new EventEmitter();
  @Output() handleDeleteGateway = new EventEmitter();

  gatewayStatusInfo = input<TGatewayStatusInfo | null>(null);
  isDetachMode = input(false);
  isWaitingOnBoard = input(false);
  isConnected = input(false);
  gwCurrentMode = GW_CURRENT_MODE;
  gwSshMode = GATEWAY_SSH_MODE;
  gwStatus = GATEWAY_STATUE;
  booleanStatus = BOOLEAN_STATUS;
  permission = PERMISSION;

  get switchRunningMode() {
    return GW_RUNNING_MODE.Active === this.gatewayStatusInfo().currentMode
      ? GW_RUNNING_MODE[GW_RUNNING_MODE.Passive]
      : GW_RUNNING_MODE[GW_RUNNING_MODE.Active];
  }

  logo = computed(() => {
    if (!this.gatewayStatusInfo()) {
      return '';
    }

    if (this.gatewayStatusInfo()?.gatewayIconPath) {
      return `${this.gatewayStatusInfo().gatewayIconPath}?timestamp=${Date.now()}`;
    }

    if (!this.gatewayStatusInfo().ipcVendorName || !this.gatewayStatusInfo().ipcModelSeriesName) {
      return '/assets/images/default_gateway.png';
    }

    if (this.gatewayStatusInfo().isPartnerIpc === BOOLEAN_STATUS.TRUE) {
      return `/assets/images/default_${this.gatewayStatusInfo().ipcVendorName.toLowerCase()}-${this.gatewayStatusInfo().ipcModelSeriesName}.png?timestamp=${Date.now()}`;
    } else {
      return '/assets/images/default_gateway.png';
    }
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

  onFetchGwHwInfo = () => {
    this.handelFetchGwHwInfo.emit();
  };

  onDetach = () => {
    this.handleDetachMode.emit();
  };

  onDeleteGateway = () => {
    this.handleDeleteGateway.emit();
  };

  onSwitchRunMode = (mode: string) => {
    this.handleSwitchRunningMode.emit({ mode: GW_RUNNING_MODE[mode] });
  };
}
