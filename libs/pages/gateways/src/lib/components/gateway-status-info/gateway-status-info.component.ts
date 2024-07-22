import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Output, computed, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SafePipe } from '@neo-edge-web/directives';
import {
  BOOLEAN_STATUS,
  GATEWAY_SSH_MODE,
  GATEWAY_SSH_STATUS,
  GATEWAY_STATUE,
  GW_CURRENT_MODE,
  IGatewaySSHStatus,
  PERMISSION,
  STATUS_COLORS,
  TGatewayStatusInfo
} from '@neo-edge-web/models';
import { datetimeFormat } from '@neo-edge-web/utils';
import { NgxPermissionsModule } from 'ngx-permissions';

@Component({
  selector: 'ne-gateway-status-info',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    SafePipe,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    NgxPermissionsModule,
    MatTooltipModule
  ],
  templateUrl: './gateway-status-info.component.html',
  styleUrl: './gateway-status-info.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GatewayStatusInfoComponent {
  @Output() handelFetchGwHwInfo = new EventEmitter();
  @Output() handleDetachMode = new EventEmitter();
  @Output() handleDeleteGateway = new EventEmitter();
  @Output() handleGetInstallCommand = new EventEmitter();
  @Output() handleRebootGw = new EventEmitter();
  @Output() handleSwitchSSHMode = new EventEmitter();

  gatewayStatusInfo = input<TGatewayStatusInfo | null>(null);
  sshStatus = input<IGatewaySSHStatus | null>(null);
  isDetachMode = input(false);
  isWaitingOnBoard = input(false);
  isConnected = input(false);
  gwCurrentMode = GW_CURRENT_MODE;
  gwSshMode = GATEWAY_SSH_MODE;
  gwStatus = GATEWAY_STATUE;
  booleanStatus = BOOLEAN_STATUS;
  permission = PERMISSION;
  statusColors = STATUS_COLORS;

  logo = computed(() => {
    if (!this.gatewayStatusInfo()) {
      return '';
    }

    if (this.gatewayStatusInfo()?.gatewayIconPath) {
      return `${this.gatewayStatusInfo().gatewayIconPath}`;
    }

    if (!this.gatewayStatusInfo().ipcVendorName || !this.gatewayStatusInfo().ipcModelName) {
      return '/assets/images/default_gateway.png';
    }

    if (this.gatewayStatusInfo().isPartnerIpc === BOOLEAN_STATUS.TRUE) {
      return `/assets/images/default_${this.gatewayStatusInfo().ipcVendorName.toLowerCase()}_${this.gatewayStatusInfo().ipcModelName}.png`;
    } else {
      return '/assets/images/default_gateway.png';
    }
  });

  gatewayProfileUpdateTime = computed(() => {
    return this.gatewayStatusInfo().connectionStatusUpdatedAt > 0
      ? this.getDatetimeFormat(this.gatewayStatusInfo().connectionStatusUpdatedAt)
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

  onGetInstallCommand = () => {
    this.handleGetInstallCommand.emit();
  };

  onReboot = () => {
    this.handleRebootGw.emit();
  };

  onSwitchSSHMode = () => {
    const currentStatus = this.sshStatus()?.current?.connectionStatus || false;
    this.handleSwitchSSHMode.emit(!currentStatus ? GATEWAY_SSH_STATUS.ENABLED : GATEWAY_SSH_STATUS.DISABLED);
  };
}
