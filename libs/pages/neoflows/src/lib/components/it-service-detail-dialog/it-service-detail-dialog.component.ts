import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, EventEmitter, inject, Output } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { SupportAppsService } from '@neo-edge-web/global-services';
import { ItServiceDetailComponent } from '@neo-edge-web/it-service-profile';
import { IItServiceDetail, ISupportApps, IT_SERVICE_PROFILE_MODE, IT_SERVICE_TABLE_MODE } from '@neo-edge-web/models';

@Component({
  selector: 'ne-it-service-detail-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, ItServiceDetailComponent, MatCardModule],
  templateUrl: './it-service-detail-dialog.component.html',
  styleUrl: './it-service-detail-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItServiceDetailDialogComponent {
  @Output() handleSaveItServiceToNeoFlow = new EventEmitter<any>();
  readonly dialogRef = inject(MatDialogRef<ItServiceDetailDialogComponent>);
  supportAppService = inject(SupportAppsService);
  data = inject<{ itServiceDetail: IItServiceDetail; supportApps: ISupportApps[] }>(MAT_DIALOG_DATA);
  itServiceTableMode = IT_SERVICE_TABLE_MODE;
  itProfileMode = IT_SERVICE_PROFILE_MODE;

  appData = computed(() => {
    if (!this.data.itServiceDetail) return null;
    const result = this.supportAppService.getAppVersionData(
      this.data.itServiceDetail?.appVersionId,
      this.data.supportApps
    );
    return { isAvailable: true, ...result };
  });

  form: UntypedFormGroup;

  onClose = () => {
    this.dialogRef.close();
  };
}
