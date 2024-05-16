import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ne-gateway-meta-data',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gateway-meta-data.component.html',
  styleUrl: './gateway-meta-data.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GatewayMetaDataComponent {}
