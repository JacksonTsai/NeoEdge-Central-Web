import { CommonModule, NgComponentOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewChild, computed, input, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { NeSupportAppsComponent } from '@neo-edge-web/components';
import { ISupportAppConfig, ISupportAppConfigs, ISupportApps, ISupportAppsWithVersion } from '@neo-edge-web/models';
import { ItServiceAwsComponent } from '../it-service-aws/it-service-aws.component';
import { ItServiceAzureComponent } from '../it-service-azure/it-service-azure.component';
import { ItServiceMqttComponent } from '../it-service-mqtt/it-service-mqtt.component';

@Component({
  selector: 'ne-create-it-service',
  standalone: true,
  imports: [CommonModule, NgComponentOutlet, MatButtonModule, MatStepperModule, MatCardModule, NeSupportAppsComponent],
  templateUrl: './create-it-service.component.html',
  styleUrl: './create-it-service.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateItServiceComponent {
  @ViewChild('stepper') private stepper: MatStepper;
  supportApps = input<ISupportApps[]>();
  currentApp = signal<ISupportAppConfig>({ component: null });

  supportAppsAvailable = computed(() => {
    return this.supportApps()?.filter((v) => v.isAvailable);
  });

  supportAppsUnavailable = computed(() => {
    return this.supportApps()?.filter((v) => !v.isAvailable);
  });

  onAppClick = (payload: ISupportAppsWithVersion): void => {
    this.stepper.next();
    this.currentApp.set(this.getApps()[payload.key]);
  };

  getApps(): ISupportAppConfigs {
    return {
      AWS: {
        component: ItServiceAwsComponent
        // inputs: {},
      },
      AZURE: {
        component: ItServiceAzureComponent
        // inputs: {},
      },
      MQTT: {
        component: ItServiceMqttComponent
        // inputs: {},
      }
    };
  }
}
