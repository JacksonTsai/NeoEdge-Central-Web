import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { IProjectByIdResp, User } from '@neo-edge-web/models';
import { FormatCountPipe } from '@neo-edge-web/pipes';

@Component({
  selector: 'ne-dashboard-users',
  standalone: true,
  imports: [CommonModule, MatExpansionModule, FormatCountPipe],
  templateUrl: './dashboard-users.component.html',
  styleUrl: './dashboard-users.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardUsersComponent {
  projectDetail = input<IProjectByIdResp>(null);
  usersList = input<User[]>([]);

  currentUsersList = computed<User[]>(() => {
    if (!this.projectDetail() || !this.usersList().length) return [];
    const usersArr = this.projectDetail().users;
    return this.usersList().filter((user) => usersArr.includes(user.id));
  });
}
