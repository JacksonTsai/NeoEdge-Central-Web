import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { DeleteGatewayConfirmComponent } from '../../components/delete-gateway-confirm/delete-gateway-confirm.component';
import { GatewayHwInfoComponent } from '../../components/gateway-hw-info/gateway-hw-info.component';
import { GatewayLogComponent } from '../../components/gateway-log/gateway-log.component';
import { GatewayMetaDataComponent } from '../../components/gateway-meta-data/gateway-meta-data.component';
import { GatewayNeoedgxComponent } from '../../components/gateway-neoedgx/gateway-neoedgx.component';
import { GatewayNeoflowComponent } from '../../components/gateway-neoflow/gateway-neoflow.component';
import { GatewayRemoteAccessComponent } from '../../components/gateway-remote-access/gateway-remote-access.component';
import { GatewayStatusInfoComponent } from '../../components/gateway-status-info/gateway-status-info.component';
import { GatewayDetailStore } from '../../stores/gateway-detail.store';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    GatewayStatusInfoComponent,
    GatewayRemoteAccessComponent,
    GatewayNeoflowComponent,
    GatewayNeoedgxComponent,
    GatewayMetaDataComponent,
    GatewayLogComponent,
    DeleteGatewayConfirmComponent,
    GatewayHwInfoComponent
  ],
  templateUrl: './gateway-detail-page.component.html',
  styleUrl: './gateway-detail-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [GatewayDetailStore]
})
export class GatewayDetailPageComponent {
  gwDetailStore = inject(GatewayDetailStore);
}
