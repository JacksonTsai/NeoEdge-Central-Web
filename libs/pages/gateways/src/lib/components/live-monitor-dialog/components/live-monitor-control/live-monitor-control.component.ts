import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ne-live-monitor-control',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './live-monitor-control.component.html',
  styleUrl: './live-monitor-control.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LiveMonitorControlComponent {}
