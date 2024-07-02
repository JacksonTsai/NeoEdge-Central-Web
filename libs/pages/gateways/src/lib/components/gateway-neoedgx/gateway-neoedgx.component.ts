import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Output, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { GW_RUNNING_MODE, PERMISSION, TNeoEdgeXInfo } from '@neo-edge-web/models';
import { NgxPermissionsModule } from 'ngx-permissions';

@Component({
  selector: 'ne-gateway-neoedgx',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, NgxPermissionsModule],
  templateUrl: './gateway-neoedgx.component.html',
  styleUrl: './gateway-neoedgx.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GatewayNeoedgxComponent {
  @Output() handleUpgradeNeoEdgeX = new EventEmitter();
  @Output() handleDetachMode = new EventEmitter();
  isDetachMode = input(false);
  isWaitingOnBoard = input(false);
  isConnected = input(false);
  neoedgexInfo = input<TNeoEdgeXInfo>();
  gwRunningMode = GW_RUNNING_MODE;
  permission = PERMISSION;

  get switchRunningMode() {
    return GW_RUNNING_MODE.Active === this.neoedgexInfo()?.desiredMode
      ? GW_RUNNING_MODE[GW_RUNNING_MODE.Passive]
      : GW_RUNNING_MODE[GW_RUNNING_MODE.Active];
  }

  onUpgradeNeoedgex = () => {
    this.handleUpgradeNeoEdgeX.emit();
  };

  onDetachMode = () => {
    this.handleDetachMode.emit();
  };
}
