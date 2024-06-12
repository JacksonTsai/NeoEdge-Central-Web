import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ne-it-service-azure',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './it-service-azure.component.html',
  styleUrl: './it-service-azure.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItServiceAzureComponent {}
