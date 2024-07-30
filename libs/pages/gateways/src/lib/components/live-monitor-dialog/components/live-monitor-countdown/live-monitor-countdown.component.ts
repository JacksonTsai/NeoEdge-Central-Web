import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'ne-live-monitor-countdown',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './live-monitor-countdown.component.html',
  styleUrl: './live-monitor-countdown.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LiveMonitorCountdownComponent {
  isRunning = input(false);
}
