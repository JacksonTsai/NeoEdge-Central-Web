import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CreateOtProfileComponent } from '../../components';
import { CreateOtDevicesStore } from '../../stores/create-ot-device.store';

@Component({
  selector: 'ne-create-ot-device-page',
  standalone: true,
  imports: [CreateOtProfileComponent],
  template: `
    <ne-create-ot-profile
      [supportDevices]="supportDevices()"
      [texolTagDoc]="texolTagDoc()"
      (handleCreateOtDevice)="onCreateOtDevice($event)"
    ></ne-create-ot-profile>
  `,
  styleUrl: './create-ot-device-page.component.scss',
  providers: [CreateOtDevicesStore],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateOtDevicePageComponent {
  #createOtDevicesStore = inject(CreateOtDevicesStore);
  supportDevices = this.#createOtDevicesStore.supportDevices;
  texolTagDoc = this.#createOtDevicesStore.texolTagDoc;

  onCreateOtDevice = (event) => {
    this.#createOtDevicesStore.createOtDevice({ profile: event.profile, deviceIcon: event?.deviceProfile?.deviceIcon });
  };
}
