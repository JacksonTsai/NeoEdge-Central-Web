import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Gateway } from '@neo-edge-web/models';

@Component({
  selector: 'ne-dashboard-gateway-location',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-gateway-location.component.html',
  styleUrl: './dashboard-gateway-location.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardGatewayLocationComponent {
  gatewaysList = input<Gateway[]>([]);
}
