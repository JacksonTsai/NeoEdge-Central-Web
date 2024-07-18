import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
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
  companyLicense = this.#licenseStore.companyLicense;
  companyOrders = this.#licenseStore.companyOrders;
}
