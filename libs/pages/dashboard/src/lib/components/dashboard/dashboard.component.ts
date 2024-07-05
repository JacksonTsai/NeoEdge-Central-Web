import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Output, input } from '@angular/core';
import {
  DASHBOARD_LOADING,
  Gateway,
  IDashboardActivitiesTime,
  IEventsDoc,
  IItService,
  IOtDevice,
  IProjectByIdResp,
  ISupportApps,
  User
} from '@neo-edge-web/models';
import { DashboardActivitiesComponent } from '../dashboard-activities/dashboard-activities.component';
import { DashboardGatewayComponent } from '../dashboard-gateway';
import { DashboardItOtComponent } from '../dashboard-it-ot/dashboard-it-ot.component';
import { DashboardProjectComponent } from '../dashboard-project/dashboard-project.component';
import { DashboardUsersComponent } from '../dashboard-users/dashboard-users.component';
import { UpdateDashboardDateComponent } from '../update-dashboard-date/update-dashboard-date.component';

@Component({
  selector: 'ne-dashboard',
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
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent {
  @Output() handleReload = new EventEmitter();
  @Output() handleActivitiesScrollEnd = new EventEmitter();
  isLoading = input<DASHBOARD_LOADING>(DASHBOARD_LOADING.NONE);
  projectDetail = input<IProjectByIdResp>(null);
  usersList = input<User[]>([]);
  itList = input<IItService[]>([]);
  itApps = input<ISupportApps[]>([]);
  otList = input<IOtDevice<any>[]>([]);
  otApps = input<ISupportApps[]>([]);
  gatewaysList = input<Gateway[]>([]);
  activitiesList = input<IDashboardActivitiesTime>(null);
  eventsDoc = input<IEventsDoc>(null);

  onReload(): void {
    this.handleReload.emit();
  }

  onScrollEnd(): void {
    this.handleActivitiesScrollEnd.emit();
  }
}
