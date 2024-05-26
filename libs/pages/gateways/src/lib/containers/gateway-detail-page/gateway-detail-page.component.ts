import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { GATEWAY_LOADING, IEditGatewayProfileReq } from '@neo-edge-web/models';
import { GatewayOperationComponent, GatewayProfileComponent } from '../../components';
import { DeleteGatewayConfirmComponent } from '../../components/delete-gateway-confirm/delete-gateway-confirm.component';
import { GatewayLogComponent } from '../../components/gateway-log/gateway-log.component';
import { GatewayNeoflowComponent } from '../../components/gateway-neoflow/gateway-neoflow.component';
import { GatewayStatusInfoComponent } from '../../components/gateway-status-info/gateway-status-info.component';
import { GatewayDetailStore } from '../../stores/gateway-detail.store';
@Component({
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    GatewayProfileComponent,
    GatewayStatusInfoComponent,
    GatewayNeoflowComponent,
    GatewayLogComponent,
    GatewayOperationComponent,
    DeleteGatewayConfirmComponent,
    MatCardModule
  ],
  templateUrl: './gateway-detail-page.component.html',
  styleUrl: './gateway-detail-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [GatewayDetailStore]
})
export class GatewayDetailPageComponent {
  gwDetailStore = inject(GatewayDetailStore);
  definedLabel = this.gwDetailStore.labels;
  isLoading = this.gwDetailStore.isLoading;

  constructor() {
    effect(
      () => {
        if (this.isLoading() === GATEWAY_LOADING.REFRESH_METADATA) {
          this.gwDetailStore.getGatewayDetail();
        }
      },
      { allowSignalWrites: true }
    );
  }

  gatewayStatusInfo = computed(() => {
    if (!this.gwDetailStore.gatewayDetail()) {
      return null;
    }
    const {
      name,
      ipcVendorName,
      gatewayIconPath,
      connectionStatus,
      currentMode,
      sshMode,
      tpmEnabled,
      gatewaySystemInfoUpdateAt,
      ipcModelName,
      isPartnerIpc,
      ipcModelSeriesName
    } = this.gwDetailStore.gatewayDetail();
    return {
      name,
      ipcVendorName,
      ipcModelName,
      gatewayIconPath,
      connectionStatus,
      currentMode,
      sshMode,
      tpmEnabled,
      gatewaySystemInfoUpdateAt,
      isPartnerIpc,
      ipcModelSeriesName
    };
  });

  onSaveProfile = ({ gatewayProfile, gatewayIcon }: { gatewayProfile: IEditGatewayProfileReq; gatewayIcon: File }) => {
    this.gwDetailStore.editGatewayProfile({ gatewayProfile, gatewayIcon });
  };
}
