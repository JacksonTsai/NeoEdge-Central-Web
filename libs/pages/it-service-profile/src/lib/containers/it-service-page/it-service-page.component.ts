import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CopyProfileDialogComponent } from '@neo-edge-web/components';
import { IItService, IT_SERVICE_LOADING, TableQueryForItService } from '@neo-edge-web/models';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ItServicesComponent } from '../../components';
import { DeleteItServiceDialogComponent } from '../../components/delete-it-service-dialog/delete-it-service-dialog.component';
import { ItServiceStore } from '../../stores/it-service.store';

@UntilDestroy()
@Component({
  selector: 'ne-it-service-page',
  standalone: true,
  imports: [CommonModule, ItServicesComponent],
  template: `
    <ne-it-services
      [dataTable]="dataTable()"
      [dataLength]="dataLength()"
      [page]="tablePage()"
      [size]="tableSize()"
      (pageChange)="onPageChange($event)"
      (handleCreate)="onCreate()"
      (handleCopy)="onCopy($event)"
      (handleDelete)="onDelete($event)"
    ></ne-it-services>
  `,
  styleUrl: './it-service-page.component.scss',
  providers: [ItServiceStore],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItServicePageComponent {
  #router = inject(Router);
  #dialog = inject(MatDialog);
  #itServiceStore = inject(ItServiceStore);
  dataTable = this.#itServiceStore.dataTable;
  dataLength = this.#itServiceStore.dataLength;
  tablePage = this.#itServiceStore.page;
  tableSize = this.#itServiceStore.size;
  isLoading = this.#itServiceStore.isLoading;

  constructor() {
    effect(
      () => {
        if (this.isLoading() === IT_SERVICE_LOADING.REFRESH_TABLE) {
          this.#itServiceStore.queryDataTableByPage({ size: this.tableSize() });
        }
      },
      { allowSignalWrites: true }
    );
  }

  onCreate = (): void => {
    this.#router.navigate([`neoflow/it-service-profile/create`]);
  };

  onCopy = (event: IItService): void => {
    let copyDialogRef = this.#dialog.open(CopyProfileDialogComponent, {
      panelClass: 'med-dialog',
      disableClose: true,
      autoFocus: false,
      restoreFocus: false,
      data: {
        type: 'it',
        fromCopyOpts: [...this.#itServiceStore.dataTable().map((d) => ({ displayName: d.name, id: d.id }))],
        deleteFn: this.#itServiceStore.deleteItService
      }
    });

    copyDialogRef
      .afterClosed()
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        copyDialogRef = undefined;
      });
  };

  onDelete = (event: IItService): void => {
    let deleteDialogRef = this.#dialog.open(DeleteItServiceDialogComponent, {
      panelClass: 'med-dialog',
      disableClose: true,
      autoFocus: false,
      restoreFocus: false,
      data: { itService: event, itServiceStore: this.#itServiceStore }
    });

    deleteDialogRef
      .afterClosed()
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        deleteDialogRef = undefined;
      });
  };

  onPageChange = (event: TableQueryForItService): void => {
    this.#itServiceStore.queryDataTableByPage(event);
  };
}
