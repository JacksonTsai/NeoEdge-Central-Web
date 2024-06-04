import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'ne-gateway-applications',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './gateway-applications.component.html',
  styleUrl: './gateway-applications.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GatewayApplicationsComponent {}
