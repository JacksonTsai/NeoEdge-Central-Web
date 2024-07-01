import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { IProjectByIdResp, User } from '@neo-edge-web/models';
import { FormatCountPipe } from '@neo-edge-web/pipes';

interface IUsersGroupItem {
  name: string;
  list: User[];
}

type IUsersGroup = Record<string, IUsersGroupItem>;

@Component({
  selector: 'ne-dashboard-users',
  standalone: true,
  imports: [CommonModule, MatExpansionModule, MatIconModule, FormatCountPipe],
  templateUrl: './dashboard-users.component.html',
  styleUrl: './dashboard-users.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardUsersComponent {
  projectDetail = input<IProjectByIdResp>(null);
  usersList = input<User[]>([]);

  userFilter = computed<User[]>(() => {
    if (!this.projectDetail() || !this.usersList().length) return [];
    return this.usersList().filter((user) => this.projectDetail().users.includes(user.id));
  });

  currentUsersList = computed<IUsersGroup>(() => {
    if (!this.userFilter().length) return null;

    const result: IUsersGroup = {};

    this.userFilter().forEach((user) => {
      const key = user.roleName;
      if (!result[key]) {
        result[key] = {
          name: key,
          list: []
        };
      }

      result[key]?.list.push(user);
    });

    return result;
  });
}
