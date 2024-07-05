import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, EventEmitter, HostListener, input, Output } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { IEventsDoc, IGetProjectEventLogsResp, IProjectEvents } from '@neo-edge-web/models';
import { dateTimeFormatPipe } from '@neo-edge-web/pipes';

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
  activitiesList = input<IGetProjectEventLogsResp>(null);
  eventsDoc = input<IEventsDoc>(null);

  events = computed<IProjectEvents[]>(() => this.activitiesList()?.events ?? []);

  @HostListener('window:scroll', ['$event'])
  onScroll($event) {
    const target = $event.target;
    if (target.scrollTop + target.clientHeight >= target.scrollHeight) {
      this.handleScrollEnd.emit();
    }
  }
}
