import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CreateItServiceComponent } from '../../components/create-it-service/create-it-service.component';
import { ItServiceStore } from '../../stores/it-service.store';

@Component({
  selector: 'ne-create-it-service-page',
  standalone: true,
  imports: [CommonModule, CreateItServiceComponent],
  template: ` <ne-create-it-service [supportApps]="supportApps()"></ne-create-it-service> `,
  styleUrl: './create-it-service-page.component.scss',
  providers: [ItServiceStore],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateItServicePageComponent {
  itServiceStore = inject(ItServiceStore);
  supportApps = this.itServiceStore.supportApps;
}
