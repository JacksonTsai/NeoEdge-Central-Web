import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ne-gateway-remote-access',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gateway-remote-access.component.html',
  styleUrl: './gateway-remote-access.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GatewayRemoteAccessComponent {}
