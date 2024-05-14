import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Gateway, TableQueryForGateways } from '@neo-edge-web/models';
import { GatewaysComponent } from '../../components';
import { GatewaysStore } from '../../stores/gateways.store';

@Component({
  selector: 'ne-gateways-page',
  standalone: true,
  imports: [CommonModule, GatewaysComponent, MatDialogModule],
  template: `
    <ne-gateways
      [gatewayDataTable]="gatewaysTable()"
      [page]="tablePage()"
      [size]="tableSize()"
      [isLoading]="isLoading()"
      [gatewaysLength]="gatewaysLength()"
      (pageChange)="onPageChange($event)"
      (handleAddGateway)="onAddGateway()"
      (handleManageLabels)="onManageLabels()"
      (handleGatewayDetail)="onGatewayDetail($event)"
    ></ne-gateways>
  `,
  styleUrl: './gateways-page.component.scss',
  providers: [GatewaysStore],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GatewaysPageComponent {
  gatewaysStore = inject(GatewaysStore);
  gatewaysTable = this.gatewaysStore.gatewayTable;
  tablePage = this.gatewaysStore.page;
  tableSize = this.gatewaysStore.size;
  gatewaysLength = this.gatewaysStore.gatewaysLength;
  queryKey = this.gatewaysStore.queryKey;
  isLoading = this.gatewaysStore.isLoading;
  #dialog = inject(MatDialog);

  onAddGateway = () => {
    //
  };

  onManageLabels = () => {
    //
  };

  onGatewayDetail = (event: Gateway) => {
    console.log(event);
  };

  onPageChange = (event: TableQueryForGateways) => {
    this.gatewaysStore.queryGatewayTableByPage(event);
  };
}
