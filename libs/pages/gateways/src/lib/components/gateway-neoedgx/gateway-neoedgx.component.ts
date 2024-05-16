import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ne-gateway-neoedgx',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gateway-neoedgx.component.html',
  styleUrl: './gateway-neoedgx.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GatewayNeoedgxComponent {}
