import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { TableQueryForCompanyOrder } from '@neo-edge-web/models';
import { LicenseOrdersComponent, LicenseOverviewComponent } from '../../components';
import { LicenseStore } from '../../stores';

enum LICENSE_TAB {
  OVERVIEW,
  PURCHASED_RECORDS
}

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
  companyLicenses = this.#licenseStore.companyLicenses;
  companyOrders = this.#licenseStore.companyOrders;
  tabIndex = signal<number>(0);

  onTabChange = (event: MatTabChangeEvent): void => {
    this.tabIndex.set(event.index);
    if (event.index === LICENSE_TAB.PURCHASED_RECORDS) {
      if (!this.companyOrders().length) {
        this.#licenseStore.getCompanyOrders({ page: this.page(), size: this.size() });
      }
    }
  };

  onOrderPageChange = (event: TableQueryForCompanyOrder): void => {
    this.#licenseStore.getCompanyOrders(event);
  };
}
