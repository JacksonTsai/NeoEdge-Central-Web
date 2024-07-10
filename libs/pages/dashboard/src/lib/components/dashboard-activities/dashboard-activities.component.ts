import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, EventEmitter, HostListener, input, Output } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { IEventDoc, IEventLog, IGetEventLogsResp } from '@neo-edge-web/models';
import { dateTimeFormatPipe } from '@neo-edge-web/pipes';
import { getEventSource } from '@neo-edge-web/utils';
@Component({
  selector: 'ne-dashboard-activities',
  standalone: true,
  imports: [CommonModule, MatExpansionModule, MatIconModule, MatTooltipModule, dateTimeFormatPipe],
  templateUrl: './dashboard-activities.component.html',
  styleUrl: './dashboard-activities.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardActivitiesComponent {
  @Output() handleScrollEnd = new EventEmitter();
  activitiesList = input<IGetEventLogsResp>(null);
  eventDoc = input<IEventDoc>(null);
  events = computed<IEventLog[]>(() => this.activitiesList()?.events ?? []);

  getEventSource = getEventSource;

  @HostListener('window:scroll', ['$event'])
  onScroll($event) {
    const target = $event.target;
    if (target.scrollTop + target.clientHeight >= target.scrollHeight) {
      this.handleScrollEnd.emit();
    }
  }
}
