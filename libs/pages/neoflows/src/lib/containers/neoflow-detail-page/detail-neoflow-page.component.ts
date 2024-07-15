import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ne-detail-neoflow-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detail-neoflow-page.component.html',
  styleUrl: './detail-neoflow-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DetailNeoflowPageComponent {}
