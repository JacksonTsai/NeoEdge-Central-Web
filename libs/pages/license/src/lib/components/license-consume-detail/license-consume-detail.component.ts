import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, input } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ICompanyLicenseProject } from '@neo-edge-web/models';

@Component({
  selector: 'ne-license-consume-detail',
  standalone: true,
  imports: [CommonModule, MatTableModule],
  templateUrl: './license-consume-detail.component.html',
  styleUrl: './license-consume-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LicenseConsumeDetailComponent {
  dataTable = input<ICompanyLicenseProject[]>();
  displayedColumns: string[] = ['no', 'name', 'quantity', 'createdBy'];
  dataSource = new MatTableDataSource<any>();

  constructor() {
    effect(() => {
      this.dataSource.data = this.dataTable();
    });
  }
}
