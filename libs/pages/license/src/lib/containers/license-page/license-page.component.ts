import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { ICompanyLicense, TableQueryForCompanyOrder } from '@neo-edge-web/models';
import { LicenseOrdersComponent, LicenseOverviewComponent } from '../../components';
import { LicenseStore } from '../../stores';

enum LICENSE_TAB {
  OVERVIEW,
  PURCHASED_RECORDS
}

const COMPANY_LICENSE: ICompanyLicense[] = [
  {
    name: 'NeoEdge X License', //license's name
    quantity: 10, // company's all purchased quantity
    projects: [
      {
        id: 1,
        name: 'projectA',
        quantity: 4, //project's used quantity
        createdBy: 'may.jhao@ecloudvalley.com'
      },
      {
        id: 2,
        name: 'projectB',
        quantity: 4,
        createdBy: 'may.jhao@ecloudvalley.com'
      }
    ]
  },
  {
    name: 'NeoEdge Tag X Licese',
    quantity: 10,
    projects: [
      {
        id: 1,
        name: 'projectA',
        quantity: 4,
        createdBy: 'may.jhao@ecloudvalley.com'
      },
      {
        id: 2,
        name: 'projectB',
        quantity: 4,
        createdBy: 'may.jhao@ecloudvalley.com'
      }
    ]
  },
  {
    name: 'TEXOL 213MM2-R1 License',
    quantity: 10,
    projects: []
  }
];

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

  companyLicenseMock = COMPANY_LICENSE;

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
