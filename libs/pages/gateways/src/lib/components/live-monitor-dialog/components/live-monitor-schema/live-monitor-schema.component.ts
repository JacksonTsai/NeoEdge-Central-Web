import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'ne-live-monitor-schema',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './live-monitor-schema.component.html',
  styleUrl: './live-monitor-schema.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LiveMonitorSchemaComponent {}
