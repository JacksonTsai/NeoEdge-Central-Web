import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GatewayHwInfoComponent } from '../gateway-hw-info/gateway-hw-info.component';
import { GatewayNeoedgxComponent } from '../gateway-neoedgx/gateway-neoedgx.component';
import { GatewayRemoteAccessComponent } from '../gateway-remote-access/gateway-remote-access.component';

@Component({
  selector: 'ne-gateway-operation',
  standalone: true,
  imports: [CommonModule, GatewayNeoedgxComponent, GatewayHwInfoComponent, GatewayRemoteAccessComponent],
  templateUrl: './gateway-operation.component.html',
  styleUrl: './gateway-operation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GatewayOperationComponent {}
