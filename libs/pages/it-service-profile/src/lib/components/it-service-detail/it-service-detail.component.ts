import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
  computed,
  effect,
  inject,
  input,
  signal
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { NeSupportAppItemComponent } from '@neo-edge-web/components';
import { ItServiceDetailService } from '@neo-edge-web/global-services';
import {
  IItServiceDetail,
  IItServiceDetailSelectedAppData,
  ISupportAppsWithVersion,
  IT_SERVICE_DETAIL_LOADING,
  IT_SERVICE_DETAIL_MODE,
  IUpdateItServiceDetailReq
} from '@neo-edge-web/models';
import { ItServiceAwsComponent } from '../it-service-aws/it-service-aws.component';
import { ItServiceAzureComponent } from '../it-service-azure/it-service-azure.component';
import { ItServiceMqttComponent } from '../it-service-mqtt/it-service-mqtt.component';

@Component({
  selector: 'ne-it-service-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
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
  @Output() handleSubmitItService = new EventEmitter<IUpdateItServiceDetailReq>();
  itServiceDetailService = inject(ItServiceDetailService);
  itServiceDetail = input<IItServiceDetail>();
  appData = input<ISupportAppsWithVersion>();
  isLoading = input<IT_SERVICE_DETAIL_LOADING>();
  #fb = inject(FormBuilder);
  form: UntypedFormGroup;

  mode = signal<IT_SERVICE_DETAIL_MODE>(IT_SERVICE_DETAIL_MODE.VEIW);
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

  onEdit = (): void => {
    this.mode.set(IT_SERVICE_DETAIL_MODE.EDIT);
  };

  onCancelEdit = (): void => {
    this.mode.set(IT_SERVICE_DETAIL_MODE.CANCEL);
  };

  onSave = (): void => {
    this.mode.set(IT_SERVICE_DETAIL_MODE.VEIW);
    const payload: IUpdateItServiceDetailReq = this.form.get('itServiceForm').value;
    this.handleSubmitItService.emit({
      name: payload.name,
      setting: payload.setting
    });
  };
}
