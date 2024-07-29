import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, EventEmitter, input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { IDashboardTimeRecord } from '@neo-edge-web/models';
import { dateTimeFormatPipe } from '@neo-edge-web/pipes';

@Component({
  selector: 'ne-update-dashboard-date',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatTooltipModule, dateTimeFormatPipe],
  templateUrl: './update-dashboard-date.component.html',
  styleUrl: './update-dashboard-date.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UpdateDashboardDateComponent {
  @Output() handleReload = new EventEmitter();
  timeRecord = input<IDashboardTimeRecord>(null);

  timestamp = computed<number>(() => {
    return this.timeRecord()?.activitiesTime?.end || this.getTimestamp(new Date());
  });

  getTimestamp(time: Date): number {
    return Math.floor(time.getTime() / 1000);
  }

  onReload(): void {
    this.handleReload.emit();
  }
}
