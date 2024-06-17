import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { SupportAppsService } from '@neo-edge-web/global-services';
import { ItServiceDetailComponent } from '../../components';
import { ItServiceDetailStore } from '../../stores/it-service-detail.store';
import { ItServiceStore } from '../../stores/it-service.store';

@Component({
  selector: 'ne-it-service-detail-page',
  standalone: true,
  imports: [CommonModule, ItServiceDetailComponent],
  template: `
    <ne-it-service-detail
      [isLoading]="isLoading()"
      [itServiceDetail]="itServiceDetail()"
      [appData]="appData()"
    ></ne-it-service-detail>
  `,
  styleUrl: './it-service-detail-page.component.scss',
  providers: [ItServiceStore, ItServiceDetailStore],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItServiceDetailPageComponent {
  #ItServiceStore = inject(ItServiceStore);
  #itServiceDetailStore = inject(ItServiceDetailStore);
  supportAppService = inject(SupportAppsService);
  itServiceDetail = this.#itServiceDetailStore.itServiceDetail;
  isLoading = this.#itServiceDetailStore.isLoading;
  supportApps = this.#ItServiceStore.supportApps;
  projectId = this.#ItServiceStore.projectId;

  appData = computed(() => {
    if (!this.itServiceDetail()) return null;
    const result = this.supportAppService.getAppVersionData(this.itServiceDetail()?.appVersionId, this.supportApps());
    return { isAvailable: true, ...result };
  });
}
