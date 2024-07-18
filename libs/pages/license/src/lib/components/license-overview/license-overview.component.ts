import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ne-license-overview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './license-overview.component.html',
  styleUrl: './license-overview.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LicenseOverviewComponent {}
