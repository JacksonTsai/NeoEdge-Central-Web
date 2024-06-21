import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Gateway, IItService, IOtDevice, IProjectByIdResp, User } from '@neo-edge-web/models';
import { DashboardGatewayComponent } from '../dashboard-gateway';
import { DashboardItOtComponent } from '../dashboard-it-ot/dashboard-it-ot.component';
import { DashboardProjectComponent } from '../dashboard-project/dashboard-project.component';
import { DashboardUsersComponent } from '../dashboard-users/dashboard-users.component';

@Component({
  selector: 'ne-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    DashboardProjectComponent,
    DashboardUsersComponent,
    DashboardItOtComponent,
    DashboardGatewayComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent {
  projectDetail = input<IProjectByIdResp>(null);
  usersList = input<User[]>([]);
  itList = input<IItService[]>([]);
  otList = input<IOtDevice<any>[]>([]);
  gatewaysList = input<Gateway[]>([]);
}
