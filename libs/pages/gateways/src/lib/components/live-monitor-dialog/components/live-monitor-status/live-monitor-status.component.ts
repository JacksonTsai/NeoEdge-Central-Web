import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { LiveMonitorStatusItemComponent } from '../live-monitor-status-item/live-monitor-status-item.component';

@Component({
  selector: 'ne-live-monitor-status',
  standalone: true,
  imports: [CommonModule, MatCardModule, LiveMonitorStatusItemComponent],
  templateUrl: './live-monitor-status.component.html',
  styleUrl: './live-monitor-status.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LiveMonitorStatusComponent {}
