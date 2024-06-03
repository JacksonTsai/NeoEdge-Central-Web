import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Output, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { IGatewaySystemInfo } from '@neo-edge-web/models';
import { datetimeFormat } from '@neo-edge-web/utils';

@Component({
  selector: 'ne-gateway-hw-info',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './gateway-hw-info.component.html',
  styleUrl: './gateway-hw-info.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GatewayHwInfoComponent {
  @Output() handelFetchGwHwInfo = new EventEmitter();
  gwHwInfo = input<IGatewaySystemInfo | null>();
  isConnected = input(false);
  connectionStatus = input<number>();
  currentMode = input<number>();

  profileUpdatedTime = input<number>();

  handleDatetimeFormat = (timestamp) => {
    return datetimeFormat(timestamp);
  };

  onFetchGwHwInfo = () => {
    if (this.isConnected) {
      this.handelFetchGwHwInfo.emit();
    }
  };
}
