import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DashboardComponent } from '../../components';
import { DashboardStore } from '../../stores/dashboard.store';

@Component({
  selector: 'ne-dashboard-page',
  standalone: true,
  imports: [CommonModule, DashboardComponent],
  template: `
    <ne-dashboard
      [projectDetail]="projectDetail()"
      [usersList]="usersList()"
      [itList]="itList()"
      [itApps]="itApps()"
      [otList]="otList()"
      [otApps]="otApps()"
      [gatewaysList]="gatewaysList()"
      (handleReload)="onReload()"
    ></ne-dashboard>
  `,
  styleUrl: './dashboard-page.component.scss',
  providers: [DashboardStore],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardPageComponent {
  #dashboardStore = inject(DashboardStore);

  projectDetail = this.#dashboardStore.projectDetail;
  usersList = this.#dashboardStore.usersList;
  itList = this.#dashboardStore.itList;
  itApps = this.#dashboardStore.itApps;
  otList = this.#dashboardStore.otList;
  otApps = this.#dashboardStore.otApps;
  gatewaysList = this.#dashboardStore.gatewaysList;

  onReload(): void {
    this.#dashboardStore.getProjectDetail();
    this.#dashboardStore.getAllUsers();
    this.#dashboardStore.getAllItServiceProfiles();
    this.#dashboardStore.getAllOtDeviceProfiles();
    this.#dashboardStore.getAllGateways();
  }
}
