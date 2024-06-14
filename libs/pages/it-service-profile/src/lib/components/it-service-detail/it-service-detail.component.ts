import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { IItServiceDetail } from '@neo-edge-web/models';

@Component({
  selector: 'ne-it-service-detail',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './it-service-detail.component.html',
  styleUrl: './it-service-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItServiceDetailComponent {
  detailData = input<IItServiceDetail>();
}
