import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { TableQueryForCompanyOrder } from '@neo-edge-web/models';
import { LicenseOrdersComponent, LicenseOverviewComponent } from '../../components';
import { LicenseStore } from '../../stores';

@Component({
  selector: 'ne-license-page',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatTabsModule, LicenseOrdersComponent, LicenseOverviewComponent],
  templateUrl: './license-page.component.html',
  styleUrl: './license-page.component.scss',
  providers: [LicenseStore],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LicensePageComponent {
  #licenseStore = inject(LicenseStore);
  isLoading = this.#licenseStore.isLoading;
  page = this.#licenseStore.page;
  size = this.#licenseStore.size;
  dataLength = this.#licenseStore.dataLength;
  companyLicense = this.#licenseStore.companyLicense;
  companyOrders = this.#licenseStore.companyOrders;

  onOrderPageChange = (event: TableQueryForCompanyOrder): void => {
    this.#licenseStore.getCompanyOrders(event);
  };
}
