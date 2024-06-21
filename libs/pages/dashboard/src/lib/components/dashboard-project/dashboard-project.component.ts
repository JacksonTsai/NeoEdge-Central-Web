import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { IProjectByIdResp } from '@neo-edge-web/models';
import { dateTimeFormatPipe } from '@neo-edge-web/pipes';

@Component({
  selector: 'ne-dashboard-project',
  standalone: true,
  imports: [CommonModule, MatExpansionModule, dateTimeFormatPipe],
  templateUrl: './dashboard-project.component.html',
  styleUrl: './dashboard-project.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardProjectComponent {
  projectDetail = input<IProjectByIdResp>(null);
  panelOpenState = signal(true);
}
