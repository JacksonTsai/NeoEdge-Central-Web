import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ISupportAppsWithVersion } from '@neo-edge-web/models';

@Component({
  selector: 'ne-it-service-azure',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './it-service-azure.component.html',
  styleUrl: './it-service-azure.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItServiceAzureComponent {
  appSettings = input<ISupportAppsWithVersion>();
}
