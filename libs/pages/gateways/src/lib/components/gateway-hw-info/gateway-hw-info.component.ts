import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ne-gateway-hw-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gateway-hw-info.component.html',
  styleUrl: './gateway-hw-info.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GatewayHwInfoComponent {}
