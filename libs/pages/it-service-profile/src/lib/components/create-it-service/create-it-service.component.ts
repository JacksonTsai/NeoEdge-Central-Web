import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
  ViewChild,
  computed,
  inject,
  input,
  signal
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { NeSupportAppsComponent } from '@neo-edge-web/components';
import { ItServiceDetailService } from '@neo-edge-web/global-services';
import {
  ICreateItServiceReq,
  IItServiceDetailSelectedAppData,
  ISupportApps,
  ISupportAppsWithVersion
} from '@neo-edge-web/models';
import { ItServiceAwsComponent } from '../it-service-aws/it-service-aws.component';
import { ItServiceAzureComponent } from '../it-service-azure/it-service-azure.component';
import { ItServiceMqttComponent } from '../it-service-mqtt/it-service-mqtt.component';

@Component({
  selector: 'ne-create-it-service',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatStepperModule,
    MatCardModule,
    NeSupportAppsComponent,
    ItServiceAwsComponent,
    ItServiceAzureComponent,
    ItServiceMqttComponent
  ],
  templateUrl: './create-it-service.component.html',
  styleUrl: './create-it-service.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateItServiceComponent {
  @Output() handleSubmitItService = new EventEmitter<ICreateItServiceReq>();
  @ViewChild('stepper') private stepper: MatStepper;
  supportApps = input<ISupportApps[]>();
  itServiceDetailService = inject(ItServiceDetailService);
  #fb = inject(FormBuilder);
  form: UntypedFormGroup;

  selectedApp = signal<IItServiceDetailSelectedAppData | null>(null);

  supportAppsAvailable = computed(() => {
    return this.supportApps()?.filter((v) => v.isAvailable);
  });

  supportAppsUnavailable = computed(() => {
    return this.supportApps()?.filter((v) => !v.isAvailable);
  });

  constructor() {
    this.form = this.#fb.group({
      itServiceForm: null
    });
  }

  onAppClick = (appData: ISupportAppsWithVersion): void => {
    this.stepper.next();
    this.selectedApp.set(this.itServiceDetailService.getSelectedAppSetting(appData));
  };

  onSelectionChange = (event: StepperSelectionEvent): void => {
    if (event.selectedIndex === 0) {
      this.selectedApp.set(null);
      this.form.setValue({
        itServiceForm: null
      });
    }
  };

  onSubmit = (): void => {
    const payload: ICreateItServiceReq = this.form.get('itServiceForm').value;
    this.handleSubmitItService.emit(payload);
  };
}
