import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { IProjectByIdResp, User } from '@neo-edge-web/models';
import { DashboardProjectComponent } from '../dashboard-project/dashboard-project.component';
import { DashboardUsersComponent } from '../dashboard-users/dashboard-users.component';

@Component({
  selector: 'ne-dashboard',
  standalone: true,
  imports: [CommonModule, DashboardProjectComponent, DashboardUsersComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent {
  projectDetail = input<IProjectByIdResp>(null);
  usersList = input<User[]>([]);
}
