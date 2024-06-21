import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { IProjectByIdResp } from '@neo-edge-web/models';
import { DashboardProjectComponent } from '../dashboard-project/dashboard-project.component';

@Component({
  selector: 'ne-dashboard',
  standalone: true,
  imports: [CommonModule, DashboardProjectComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent {
  projectDetail = input<IProjectByIdResp>(null);
}
