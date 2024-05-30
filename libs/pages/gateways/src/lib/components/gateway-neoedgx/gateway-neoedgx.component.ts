import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Output, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { GW_RUNNING_MODE, TNeoEdgeXInfo } from '@neo-edge-web/models';

@Component({
  selector: 'ne-gateway-neoedgx',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './gateway-neoedgx.component.html',
  styleUrl: './gateway-neoedgx.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GatewayNeoedgxComponent {
  @Output() handleUpgradeNeoEdgeX = new EventEmitter();
  @Output() handleSwitchRunningMode = new EventEmitter<GW_RUNNING_MODE>();
  @Output() handleDetachMode = new EventEmitter();
  isDetachMode = input(false);
  isWaitingOnBoard = input(false);
  isConnected = input(false);
  neoedgexInfo = input<TNeoEdgeXInfo>();
  gwRunningMode = GW_RUNNING_MODE;

  get switchRunningMode() {
    return GW_RUNNING_MODE.Active === this.neoedgexInfo()?.desiredMode
      ? GW_RUNNING_MODE[GW_RUNNING_MODE.Passive]
      : GW_RUNNING_MODE[GW_RUNNING_MODE.Active];
  }

  onUpgradeNeoedgex = () => {
    this.handleUpgradeNeoEdgeX.emit();
  };

  onSwitchRunMode = () => {
    this.handleSwitchRunningMode.emit(GW_RUNNING_MODE[this.switchRunningMode]);
  };

  onDetachMode = () => {
    this.handleDetachMode.emit();
  };
}
