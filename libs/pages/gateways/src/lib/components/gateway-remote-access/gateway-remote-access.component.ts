import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  selector: 'ne-gateway-remote-access',
  standalone: true,
  imports: [CommonModule, MatSlideToggleModule],
  templateUrl: './gateway-remote-access.component.html',
  styleUrl: './gateway-remote-access.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GatewayRemoteAccessComponent {}
