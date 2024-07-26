import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import {
  DASHBOARD_LOADING,
  IBillingParamsReq,
  TGetProjectEventLogsParams,
  TUpdateEventLogMode
} from '@neo-edge-web/models';
import {
  DashboardActivitiesComponent,
  DashboardBillingComponent,
  DashboardGatewayComponent,
  DashboardItOtComponent,
  DashboardLicenseComponent,
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
    DashboardBillingComponent,
    DashboardLicenseComponent,
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
  gatewaysList = this.#dashboardStore.gatewaysList;
  itList = this.#dashboardStore.itList;
  itApps = this.#dashboardStore.itApps;
  otList = this.#dashboardStore.otList;
  otApps = this.#dashboardStore.otApps;
  eventDoc = this.#dashboardStore.eventDoc;
  activitiesList = this.#dashboardStore.activitiesList;
  projectFee = this.#dashboardStore.projectFee;
  projectLicenses = this.#dashboardStore.projectLicenses;
  timeRecord = this.#dashboardStore.timeRecord;

  constructor() {
    effect(
      () => {
        if (DASHBOARD_LOADING.INIT === this.isLoading()) {
          if (this.#dashboardStore.projectId()) {
            this.updateData();
          }
        }
      },
      {
        allowSignalWrites: true
      }
    );
  }

  onReload(): void {
    this.#dashboardStore.setTimeRecord();
    this.updateData();
  }

  loadActivities = (type: TUpdateEventLogMode): void => {
    const activitiesParams: TGetProjectEventLogsParams = {
      size: 20,
      order: 'desc',
      timeGe: this.timeRecord().activitiesTime?.start,
      timeLe: this.timeRecord().activitiesTime?.end,
      lastRecord: type === 'UPDATE' ? this.activitiesList().lastEvaluatedKey : ''
    };
    this.#dashboardStore.getActivities({ type, params: activitiesParams });
  };

  updateData = (): void => {
    this.#dashboardStore.getProjectDetail();
    this.#dashboardStore.getAllUsers();
    this.#dashboardStore.getAllItServiceProfiles();
    this.#dashboardStore.getAllOtDeviceProfiles();
    this.#dashboardStore.getAllGateways();

    this.#dashboardStore.getProjectLicense();

    this.loadActivities('GET');

    const billingParams: IBillingParamsReq = {
      dateGe: this.timeRecord().projectFeeTime?.start,
      dateLe: this.timeRecord().projectFeeTime?.end,
      groupBy: 'month'
    };
    this.#dashboardStore.getProjectUsageFee(billingParams);
  };

  onActivitiesScrollEnd(): void {
    if (this.activitiesList()?.lastEvaluatedKey && this.isLoading() !== DASHBOARD_LOADING.UPDATE_ACTIVITIES) {
      this.loadActivities('UPDATE');
    }
  }
}
