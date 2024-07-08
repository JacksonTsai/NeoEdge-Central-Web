import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Signal, computed, effect, inject, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import * as AuthStore from '@neo-edge-web/auth-store';
import { GatewayDetailService } from '@neo-edge-web/global-services';
import {
  GATEWAY_LOADING,
  GATEWAY_SSH_STATUS,
  GATEWAY_STATUE,
  GW_RUNNING_MODE,
  IEditGatewayProfileReq,
  PERMISSION,
  TGatewayStatusInfo,
  TGetGatewayEventLogsReq,
  TNeoEdgeXInfo
} from '@neo-edge-web/models';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { NgxPermissionsModule, NgxPermissionsService } from 'ngx-permissions';
import { delay, of, tap } from 'rxjs';
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
import { GatewayRebootDialogComponent } from '../../components/gateway-reboot-dialog/gateway-reboot-dialog.component';
import { GatewayStatusInfoComponent } from '../../components/gateway-status-info/gateway-status-info.component';
import { GatewayDetailStore } from '../../stores/gateway-detail.store';

enum GATEWAY_DETAIL_TAB {
  PROFILE,
  OPERATION,
  NEOFLOW,
  LOG
}

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
    GatewayApplicationsComponent,
    NgxPermissionsModule
  ],

  templateUrl: './gateway-detail-page.component.html',
  styleUrl: './gateway-detail-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [GatewayDetailStore]
})
export class GatewayDetailPageComponent {
  permission = PERMISSION;
  permissionsService = inject(NgxPermissionsService);
  #globalStore = inject(Store);
  userProfile$ = this.#globalStore.select(AuthStore.selectUserProfile);
  #dialog = inject(MatDialog);
  gwDetailStore = inject(GatewayDetailStore);
  gwDetailService = inject(GatewayDetailService);
  definedLabel = this.gwDetailStore.labels;
  isLoading = this.gwDetailStore.isLoading;
  sshStatus = this.gwDetailStore.sshStatus;
  eventDoc = this.gwDetailStore.eventDoc;
  eventLogsList = this.gwDetailStore.eventLogsList;
  tabIndex = signal<number>(0);
  gatewayDetailTab = GATEWAY_DETAIL_TAB;

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

        if (this.isLoading() === GATEWAY_LOADING.REFRESH_SSH) {
          of(null)
            .pipe(
              delay(200),
              tap(() => {
                this.gwDetailStore.getSSHStatus();
              })
            )
            .subscribe();
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

  onRebootGw = () => {
    let rebootDialogRef = this.#dialog.open(GatewayRebootDialogComponent, {
      panelClass: 'med-dialog',
      disableClose: true,
      autoFocus: false,
      restoreFocus: false,
      data: { gwDetailStore: this.gwDetailStore }
    });

    rebootDialogRef
      .afterClosed()
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        rebootDialogRef = undefined;
      });
  };

  onSwitchSSHMode = (enabled: GATEWAY_SSH_STATUS): void => {
    this.gwDetailStore.updateSSHStatus({ enabled });
  };

  onUpdateEventLogs = (event: TGetGatewayEventLogsReq): void => {
    this.gwDetailStore.geteventLogsList({
      type: event.type,
      params: event.params
    });
  };

  onTabChange = (event: MatTabChangeEvent): void => {
    this.tabIndex.set(event.index);
    if (event.index === GATEWAY_DETAIL_TAB.OPERATION && this.isConnected) {
      // Gateway Operation
      this.permissionsService
        .hasPermission(this.permission[this.permission.APPLICATION_MANAGEMENT])
        .then((hasPermission) => {
          if (hasPermission) {
            this.gwDetailStore.getSSHStatus();
          }
        });
    } else if (event.index === GATEWAY_DETAIL_TAB.LOG) {
      if (!this.eventDoc()) {
        this.gwDetailStore.geteventDoc();
      }
    }
  };
}
