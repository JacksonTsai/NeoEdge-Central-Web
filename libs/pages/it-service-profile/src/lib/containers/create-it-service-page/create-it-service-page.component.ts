import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ICreateItServiceReq } from '@neo-edge-web/models';
import { CreateItServiceComponent } from '../../components';
import { ItServiceStore } from '../../stores/it-service.store';

@Component({
  selector: 'ne-create-it-service-page',
  standalone: true,
  imports: [CommonModule, CreateItServiceComponent],
  template: `
    <ne-create-it-service
      [supportApps]="supportApps()"
      (handleSubmitItService)="onSubmit($event)"
    ></ne-create-it-service>
  `,
  styleUrl: './create-it-service-page.component.scss',
  providers: [ItServiceStore],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateItServicePageComponent {
  #itServiceStore = inject(ItServiceStore);

  supportApps = this.#itServiceStore.supportApps;

  onSubmit = (event: ICreateItServiceReq) => {
    this.#itServiceStore.createItService(event);
  };
}
