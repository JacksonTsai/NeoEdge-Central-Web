import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, input } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { NeExpansionTableComponent } from '@neo-edge-web/components';
import { ICompanyLicense } from '@neo-edge-web/models';
import { LicenseConsumeDetailComponent } from '../license-consume-detail/license-consume-detail.component';

interface ICompanyLicenseStatistics extends ICompanyLicense {
  consumedQty: number;
  avaliableQty: number;
}

@Component({
  selector: 'ne-license-overview',
  standalone: true,
  imports: [CommonModule, MatTableModule, NeExpansionTableComponent, LicenseConsumeDetailComponent],
  templateUrl: './license-overview.component.html',
  styleUrl: './license-overview.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LicenseOverviewComponent {
  companyLicenses = input<ICompanyLicense[]>([]);
  displayedColumns: string[] = ['no', 'name', 'purchseQty', 'consumedQty', 'avaliableQty'];
  dataSource = new MatTableDataSource<any>();

  companyLicensesStatistics = computed<ICompanyLicenseStatistics[]>(() => {
    if (!this.companyLicenses().length) return [];
    return this.companyLicenses().map((item: ICompanyLicense) => {
      const consumedQty = item.projects.reduce((total, proj) => total + proj.quantity, 0);
      return {
        ...item,
        consumedQty,
        avaliableQty: item.quantity - consumedQty
      };
    });
  });

  constructor() {
    effect(() => {
      this.dataSource.data = this.companyLicensesStatistics();
    });
  }
}
