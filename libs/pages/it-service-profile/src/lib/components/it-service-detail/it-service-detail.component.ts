import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, inject, input, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { NeSupportAppItemComponent } from '@neo-edge-web/components';
import { ItServiceDetailService } from '@neo-edge-web/global-services';
import {
  IItServiceDetail,
  IItServiceDetailSelectedAppData,
  ISupportAppsWithVersion,
  IT_SERVICE_DETAIL_LOADING,
  IT_SERVICE_DETAIL_MODE
} from '@neo-edge-web/models';
import { ItServiceAwsComponent } from '../it-service-aws/it-service-aws.component';
import { ItServiceAzureComponent } from '../it-service-azure/it-service-azure.component';
import { ItServiceMqttComponent } from '../it-service-mqtt/it-service-mqtt.component';

@Component({
  selector: 'ne-it-service-detail',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    NeSupportAppItemComponent,
    ItServiceAwsComponent,
    ItServiceAzureComponent,
    ItServiceMqttComponent
  ],
  templateUrl: './it-service-detail.component.html',
  styleUrl: './it-service-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItServiceDetailComponent {
  itServiceDetailService = inject(ItServiceDetailService);
  projectId = input<number>(0);
  itServiceDetail = input<IItServiceDetail>();
  appData = input<ISupportAppsWithVersion>();
  isLoading = input<IT_SERVICE_DETAIL_LOADING>();
  #fb = inject(FormBuilder);
  form: UntypedFormGroup;

  mode = signal<IT_SERVICE_DETAIL_MODE>(IT_SERVICE_DETAIL_MODE.EDIT);
  isEditMode = computed<boolean>(() => this.mode() === IT_SERVICE_DETAIL_MODE.EDIT);
  selectedApp = signal<IItServiceDetailSelectedAppData | null>(null);

  constructor() {
    this.form = this.#fb.group({
      itServiceForm: null
    });

    effect(
      () => {
        if (this.appData()) {
          this.selectedApp.set(this.itServiceDetailService.getSelectedAppSetting(this.appData()));
        }
      },
      { allowSignalWrites: true }
    );
  }

  onCancelEdit = (): void => {
    this.mode.set(IT_SERVICE_DETAIL_MODE.VEIW);
  };

  onSave = (): void => {
    this.mode.set(IT_SERVICE_DETAIL_MODE.VEIW);
  };

  onEdit = (): void => {
    this.mode.set(IT_SERVICE_DETAIL_MODE.EDIT);
  };
}
