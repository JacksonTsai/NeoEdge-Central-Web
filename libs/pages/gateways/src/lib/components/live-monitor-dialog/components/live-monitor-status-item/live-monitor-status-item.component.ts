import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'ne-live-monitor-status-item',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatTooltipModule],
  templateUrl: './live-monitor-status-item.component.html',
  styleUrl: './live-monitor-status-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LiveMonitorStatusItemComponent {}
