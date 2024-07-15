import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, inject, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ItServicesComponent, ItServiceStore } from '@neo-edge-web/it-service-profile';
import { IItService, IT_SERVICE_TABLE_MODE, TableQueryForItService } from '@neo-edge-web/models';

@Component({
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, ItServicesComponent],
  templateUrl: './add-it-service-profile-dialog.component.html',
  styleUrl: './add-it-service-profile-dialog.component.scss',
  providers: [ItServiceStore],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddItServiceProfileDialogComponent {
  @Output() handleAddItServiceToNeoFlow = new EventEmitter();
  readonly dialogRef = inject(MatDialogRef<AddItServiceProfileDialogComponent>);
  #itServiceStore = inject(ItServiceStore);
  itServiceTableMode = IT_SERVICE_TABLE_MODE;
  itServices = this.#itServiceStore.dataTable;
  tablePage = this.#itServiceStore.page;
  tableSize = this.#itServiceStore.size;
  itServiceLength = this.#itServiceStore.dataLength;
  isLoading = this.#itServiceStore.isLoading;

  onAddItServiceToNeoFlow = (event: IItService) => {
    this.handleAddItServiceToNeoFlow.emit(event);
  };

  onClose = () => {
    this.dialogRef.close();
  };

  onPageChange = (event: TableQueryForItService) => {
    this.#itServiceStore.queryDataTableByPage(event);
  };
}
