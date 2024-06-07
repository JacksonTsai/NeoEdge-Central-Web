import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ne-it-service-detail-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './it-service-detail-page.component.html',
  styleUrl: './it-service-detail-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItServiceDetailPageComponent {}
