import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CopyProfileDialogComponent } from '@neo-edge-web/components';
import { INeoflow, NEOFLOW_LOADING, TTableQueryForNeoFlows } from '@neo-edge-web/models';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { NeoFlowsComponent } from '../../components';
import { DeleteNeoflowDialogComponent } from '../../components/delete-neoflow-dialog/delete-neoflow-dialog.component';
import { NeoflowsStore } from '../../stores/neoflows.store';
@UntilDestroy()
@Component({
  selector: 'ne-neoflow-page',
  standalone: true,
  imports: [CommonModule, NeoFlowsComponent],
  template: `
    <ne-neoflows
      [neoflows]="neoflows()"
      [page]="tablePage()"
      [size]="tableSize()"
      [neoflowsLength]="neoflowsLength()"
      (handleCreateNeoFlow)="onCreateNeoFlow()"
      (handleDeleteNeoFlow)="onDeleteNeoFlow($event)"
      (handleCopyNeoFlow)="onCopyNeoFlow($event)"
      (handlePageChange)="onPageChange($event)"
    ></ne-neoflows>
  `,
  styleUrl: './neoflows-page.component.scss',
  providers: [NeoflowsStore],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NeoflowsPageComponent {
  #neoflowStore = inject(NeoflowsStore);
  #dialog = inject(MatDialog);
  #router = inject(Router);

  neoflows = this.#neoflowStore.neoflows;
  tablePage = this.#neoflowStore.page;
  tableSize = this.#neoflowStore.size;
  neoflowsLength = this.#neoflowStore.neoflowLength;
  isLoading = this.#neoflowStore.isLoading;

  constructor() {
    effect(
      () => {
        if (NEOFLOW_LOADING.REFRESH_TABLE === this.isLoading()) {
          this.#neoflowStore.queryNeoFlowsTableByPage({ size: this.tableSize(), page: this.tablePage() });
        }
      },
      { allowSignalWrites: true }
    );
  }

  onDeleteNeoFlow = (event: INeoflow) => {
    let deleteNeoflowDialog = this.#dialog.open(DeleteNeoflowDialogComponent, {
      panelClass: 'med-dialog',
      disableClose: true,
      autoFocus: false,
      restoreFocus: false,
      data: {
        neoflow: event,
        deleteFn: this.#neoflowStore.deleteNeoFlow
      }
    });

    deleteNeoflowDialog
      .afterClosed()
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        deleteNeoflowDialog = undefined;
      });
  };

  onCopyNeoFlow = (event: INeoflow) => {
    let copyProfileRef = this.#dialog.open(CopyProfileDialogComponent, {
      panelClass: 'med-dialog',
      disableClose: true,
      autoFocus: false,
      restoreFocus: false,
      data: {
        type: 'neoflow',
        copyFrom: { displayName: event.name, id: event.id },
        copyFn: this.#neoflowStore.copyNeoFlow
      }
    });

    copyProfileRef
      .afterClosed()
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        copyProfileRef = undefined;
      });
  };

  onCreateNeoFlow = () => {
    this.#router.navigate(['neoflow/noeflow-settings/create']);
  };

  onPageChange = (event: TTableQueryForNeoFlows) => {
    this.#neoflowStore.queryNeoFlowsTableByPage(event);
  };
}
