import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { GatewayDetailService } from '@neo-edge-web/global-services';
import { IEventDoc } from '@neo-edge-web/models';
import { GatewayDetailStore } from '../../../../stores/gateway-detail.store';
import {
  LiveMonitorCpuComponent,
  LiveMonitorLogComponent,
  LiveMonitorRamComponent,
  LiveMonitorSchemaComponent,
  LiveMonitorStatusComponent
} from '../../components';

@Component({
  selector: 'ne-live-monitor-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    LiveMonitorSchemaComponent,
    LiveMonitorCpuComponent,
    LiveMonitorRamComponent,
    LiveMonitorStatusComponent,
    LiveMonitorLogComponent
  ],
  templateUrl: './live-monitor-dialog.component.html',
  styleUrl: './live-monitor-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LiveMonitorDialogComponent {
  dialogRef!: MatDialogRef<LiveMonitorDialogComponent>;
  data = inject<{
    gwDetailStore: GatewayDetailStore;
    gwDetailService: GatewayDetailService;
    eventDoc: IEventDoc;
    neoflow: any;
  }>(MAT_DIALOG_DATA);
}
