import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DASHBOARD_LOADING, TGetProjectEventLogsParams } from '@neo-edge-web/models';
import {
  DashboardActivitiesComponent,
  DashboardGatewayComponent,
  DashboardItOtComponent,
  DashboardProjectComponent,
  DashboardUsersComponent,
  UpdateDashboardDateComponent
} from '../../components';
import { DashboardStore } from '../../stores/dashboard.store';

@Component({
  selector: 'ne-dashboard-page',
  standalone: true,
  imports: [
    CommonModule,
    DashboardActivitiesComponent,
    DashboardProjectComponent,
    DashboardUsersComponent,
    DashboardItOtComponent,
    DashboardGatewayComponent,
    UpdateDashboardDateComponent
  ],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.scss',
  providers: [DashboardStore],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardPageComponent {
  #dashboardStore = inject(DashboardStore);

  isLoading = this.#dashboardStore.isLoading;
  projectDetail = this.#dashboardStore.projectDetail;
  usersList = this.#dashboardStore.usersList;
  itList = this.#dashboardStore.itList;
  itApps = this.#dashboardStore.itApps;
  otList = this.#dashboardStore.otList;
  otApps = this.#dashboardStore.otApps;
  gatewaysList = this.#dashboardStore.gatewaysList;
  activitiesList = this.#dashboardStore.activitiesList;
  eventDoc = this.#dashboardStore.eventDoc;

  onReload(): void {
    this.#dashboardStore.getProjectDetail();
    this.#dashboardStore.getAllUsers();
    this.#dashboardStore.getAllItServiceProfiles();
    this.#dashboardStore.getAllOtDeviceProfiles();
    this.#dashboardStore.getAllGateways();
  }

  onActivitiesScrollEnd(): void {
    if (this.activitiesList()?.lastEvaluatedKey && this.isLoading() !== DASHBOARD_LOADING.UPDATE_ACTIVITIES) {
      const activitiesParams: TGetProjectEventLogsParams = {
        size: 10,
        order: 'desc',
        timeGe: this.#dashboardStore.activitiesTime().start,
        timeLe: this.#dashboardStore.activitiesTime().end,
        lastRecord: this.activitiesList().lastEvaluatedKey
      };
      this.#dashboardStore.getActivities({ type: 'UPDATE', params: activitiesParams });
    }
  }
}
