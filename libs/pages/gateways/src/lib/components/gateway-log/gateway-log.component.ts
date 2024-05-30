import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ne-gateway-log',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gateway-log.component.html',
  styleUrl: './gateway-log.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GatewayLogComponent {}
