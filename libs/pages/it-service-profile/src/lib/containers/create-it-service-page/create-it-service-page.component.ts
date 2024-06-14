import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
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
      [projectId]="projectId()"
      (handleSubmitItService)="onSubmit($event)"
    ></ne-create-it-service>
  `,
  styleUrl: './create-it-service-page.component.scss',
  providers: [ItServiceStore],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateItServicePageComponent {
  #router = inject(Router);
  #itServiceStore = inject(ItServiceStore);

  supportApps = this.#itServiceStore.supportApps;
  projectId = this.#itServiceStore.projectId;

  onSubmit = (event: ICreateItServiceReq) => {
    this.#itServiceStore.createItService(event);
    this.#router.navigate([`neoflow/it-service-profile`]);
  };
}
