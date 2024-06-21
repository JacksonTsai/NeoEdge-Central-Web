import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DashboardComponent } from '../../components';
import { DashboardStore } from '../../stores/dashboard.store';

@Component({
  selector: 'ne-dashboard-page',
  standalone: true,
  imports: [CommonModule, DashboardComponent],
  template: ` <ne-dashboard [projectDetail]="projectDetail()" [usersList]="usersList()"></ne-dashboard> `,
  styleUrl: './dashboard-page.component.scss',
  providers: [DashboardStore],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardPageComponent {
  #dashboardStore = inject(DashboardStore);

  projectDetail = this.#dashboardStore.projectDetail;
  usersList = this.#dashboardStore.usersList;
}
