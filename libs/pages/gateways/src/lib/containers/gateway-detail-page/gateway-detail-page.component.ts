import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Signal, computed, effect, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { GatewayDetailService } from '@neo-edge-web/global-services';
import {
  GATEWAY_LOADING,
  GATEWAY_STATUE,
  GW_RUNNING_MODE,
  IEditGatewayProfileReq,
  TGatewayStatusInfo,
  TNeoEdgeXInfo
} from '@neo-edge-web/models';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import {
  DeleteGatewayConfirmDialogComponent,
  DetachGatewayConfirmDialogComponent,
  GatewayApplicationsComponent,
  GatewayHwInfoComponent,
  GatewayNeoedgxComponent,
  GatewayProfileComponent,
  GatewayRemoteAccessComponent
} from '../../components';
import { GatewayLogComponent } from '../../components/gateway-log/gateway-log.component';
import { GatewayNeoflowComponent } from '../../components/gateway-neoflow/gateway-neoflow.component';
import { GatewayStatusInfoComponent } from '../../components/gateway-status-info/gateway-status-info.component';
import { GatewayDetailStore } from '../../stores/gateway-detail.store';

@UntilDestroy()
@Component({
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    GatewayProfileComponent,
    GatewayStatusInfoComponent,
    GatewayNeoflowComponent,
    GatewayLogComponent,
    DeleteGatewayConfirmDialogComponent,
    MatCardModule,
    GatewayHwInfoComponent,
    GatewayNeoedgxComponent,
    GatewayRemoteAccessComponent,
    GatewayApplicationsComponent
  ],

  templateUrl: './gateway-detail-page.component.html',
  styleUrl: './gateway-detail-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [GatewayDetailStore]
})
export class GatewayDetailPageComponent {
  #dialog = inject(MatDialog);
  gwDetailStore = inject(GatewayDetailStore);
  gwDetailService = inject(GatewayDetailService);
  definedLabel = this.gwDetailStore.labels;
  isLoading = this.gwDetailStore.isLoading;

  get isDetachMode() {
    return GW_RUNNING_MODE.Detach === this.gatewayStatusInfo()?.currentMode;
  }

  get isWaitingOnBoard() {
    return (
      GW_RUNNING_MODE.Active === this.gatewayStatusInfo()?.currentMode &&
      GATEWAY_STATUE.Waiting === this.gatewayStatusInfo()?.connectionStatus
    );
  }

  get isConnected() {
    return (
      GW_RUNNING_MODE.Active === this.gatewayStatusInfo()?.currentMode &&
      GATEWAY_STATUE.Connected === this.gatewayStatusInfo()?.connectionStatus
    );
  }

  constructor() {
    effect(
      () => {
        if (this.isLoading() === GATEWAY_LOADING.REFRESH_GATEWAY_DETAIL) {
          this.gwDetailStore.getGatewayDetail();
        }
      },
      { allowSignalWrites: true }
    );
  }

  neoedgexInfo: Signal<TNeoEdgeXInfo> = computed(() => {
    if (!this.gwDetailStore.gatewayDetail()) {
      return null;
    }
    const {
      connectionStatus,
      currentMode,
      customField,
      desiredMode,
      neoedgeXArch,
      neoedgeXVersion,
      neoedgeXName,
      neoedgeXOsName,
      neoedgeXOsVersion,
      latestNeoedgeXVersion,
      latestNeoedgeXReleaseNote,
      latestNeoedgeXReleaseDate,
      gatewaySystemInfo
    } = this.gwDetailStore.gatewayDetail();

    return {
      connectionStatus,
      currentMode,
      customField,
      desiredMode,
      neoedgeXArch,
      neoedgeXVersion,
      neoedgeXName,
      neoedgeXOsName,
      neoedgeXOsVersion,
      latestNeoedgeXVersion,
      latestNeoedgeXReleaseNote,
      latestNeoedgeXReleaseDate,
      gatewaySystemInfo
    };
  });

  gatewayStatusInfo: Signal<TGatewayStatusInfo> = computed(() => {
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
      ipcModelSeriesName,
      connectionStatusUpdatedAt
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
      ipcModelSeriesName,
      connectionStatusUpdatedAt
    };
  });

  onUpgradeNeoEdgeX = () => {
    // TODO: This part will be implemented in a later scope.
  };

  onSwitchRunningMode = (event: GW_RUNNING_MODE) => {
    this.gwDetailStore.switchRunningMode({ mode: event });
  };

  onDetachMode = () => {
    if (!this.gwDetailStore?.gatewayDetail()?.name) {
      return;
    }
    let detachGatewayDialogRef = this.#dialog.open(DetachGatewayConfirmDialogComponent, {
      panelClass: 'med-dialog',
      disableClose: true,
      autoFocus: false,
      restoreFocus: false,
      data: { gwDetailStore: this.gwDetailStore, gatewayName: this.gwDetailStore.gatewayDetail().name }
    });

    detachGatewayDialogRef
      .afterClosed()
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        detachGatewayDialogRef = undefined;
      });
  };

  onDeleteGateway = () => {
    if (!this.gwDetailStore?.gatewayDetail()?.name) {
      return;
    }

    let deleteGatewayDialogRef = this.#dialog.open(DeleteGatewayConfirmDialogComponent, {
      panelClass: 'med-dialog',
      disableClose: true,
      autoFocus: false,
      restoreFocus: false,
      data: { gwDetailStore: this.gwDetailStore, gatewayName: this.gwDetailStore.gatewayDetail().name }
    });

    deleteGatewayDialogRef
      .afterClosed()
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        deleteGatewayDialogRef = undefined;
      });
  };

  onFetchGwHwInfo = () => {
    this.gwDetailStore.syncGatewayProfile();
  };

  onSaveProfile = ({ gatewayProfile, gatewayIcon }: { gatewayProfile: IEditGatewayProfileReq; gatewayIcon: File }) => {
    this.gwDetailStore.editGatewayProfile({ gatewayProfile, gatewayIcon });
  };

  onGetInstallCommand = () => {
    this.gwDetailService.getInstallCommand$(this.gwDetailStore.gatewayId()).subscribe((enrollCommand) => {
      if (enrollCommand?.command) {
        navigator.clipboard.writeText(enrollCommand.command);
      }
    });
  };
}
