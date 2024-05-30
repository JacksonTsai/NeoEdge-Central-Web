import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ne-gateway-neoflow',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gateway-neoflow.component.html',
  styleUrl: './gateway-neoflow.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GatewayNeoflowComponent {}
