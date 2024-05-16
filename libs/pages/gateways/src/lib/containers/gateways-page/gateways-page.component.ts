import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { GatewaysService } from '@neo-edge-web/global-service';
import { GATEWAYS_LOADING, Gateway, TableQueryForGateways } from '@neo-edge-web/models';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { AddGatewayDialogComponent, GatewaysComponent, MangeLabelDialogComponent } from '../../components';
import { GatewaysStore } from '../../stores/gateways.store';

@UntilDestroy()
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
      [gwLabels]="gwLabels()"
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
  gatewaysService = inject(GatewaysService);
  gatewaysTable = this.gatewaysStore.gatewayTable;
  tablePage = this.gatewaysStore.page;
  tableSize = this.gatewaysStore.size;
  gatewaysLength = this.gatewaysStore.gatewaysLength;
  queryKey = this.gatewaysStore.queryKey;
  isLoading = this.gatewaysStore.isLoading;
  gwLabels = this.gatewaysStore.labels;
  #dialog = inject(MatDialog);

  constructor() {
    effect(
      () => {
        if (this.isLoading() === GATEWAYS_LOADING.REFRESH_TABLE) {
          this.gatewaysStore.queryGatewayTableByPage({ size: this.tableSize() });
        }
      },
      { allowSignalWrites: true }
    );
  }

  onAddGateway = () => {
    let editRoleDialogRef = this.#dialog.open(AddGatewayDialogComponent, {
      panelClass: 'med-dialog',
      disableClose: true,
      autoFocus: false,
      restoreFocus: false,
      data: { gwStore: this.gatewaysStore, gwService: this.gatewaysService }
    });

    editRoleDialogRef
      .afterClosed()
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        editRoleDialogRef = undefined;
      });
  };

  onManageLabels = () => {
    let editRoleDialogRef = this.#dialog.open(MangeLabelDialogComponent, {
      panelClass: 'med-dialog',
      disableClose: true,
      autoFocus: false,
      restoreFocus: false,
      data: { gwStore: this.gatewaysStore }
    });

    editRoleDialogRef
      .afterClosed()
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        editRoleDialogRef = undefined;
      });
  };

  onGatewayDetail = (event: Gateway) => {
    console.log(event);
  };

  onPageChange = (event: TableQueryForGateways) => {
    this.gatewaysStore.queryGatewayTableByPage(event);
  };
}
