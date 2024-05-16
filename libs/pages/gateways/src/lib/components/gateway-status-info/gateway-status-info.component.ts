import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ne-gateway-status-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gateway-status-info.component.html',
  styleUrl: './gateway-status-info.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GatewayStatusInfoComponent {}
