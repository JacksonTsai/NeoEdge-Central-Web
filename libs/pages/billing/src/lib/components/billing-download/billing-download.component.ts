import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ne-billing-download',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './billing-download.component.html',
  styleUrl: './billing-download.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BillingDownloadComponent {}
