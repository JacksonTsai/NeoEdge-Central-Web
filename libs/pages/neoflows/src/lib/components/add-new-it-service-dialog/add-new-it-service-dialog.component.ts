import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, inject, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CreateItServiceComponent, ItServiceStore } from '@neo-edge-web/it-service-profile';
import { IT_SERVICE_TABLE_MODE } from '@neo-edge-web/models';

@Component({
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, CreateItServiceComponent],
  templateUrl: './add-new-it-service-dialog.component.html',
  styleUrl: './add-new-it-service-dialog.component.scss',
  providers: [ItServiceStore],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddNewItServiceDialogComponent {
  @Output() createNewItService = new EventEmitter<any>();
  @Output() createAndSaveItService = new EventEmitter<any>();

  readonly dialogRef = inject(MatDialogRef<AddNewItServiceDialogComponent>);
  #itServiceStore = inject(ItServiceStore);

  supportItService = this.#itServiceStore.supportApps;

  data = inject<any>(MAT_DIALOG_DATA);
  itServiceTableMode = IT_SERVICE_TABLE_MODE;

  onClose = () => {
    this.dialogRef.close();
  };
}
