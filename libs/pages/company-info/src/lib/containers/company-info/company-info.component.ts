import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { COMP_INFO_LOADING, IEditCompanyProfileReq } from '@neo-edge-web/models';
import { CompanyComponent } from '../../components';
import { CompanyInfoStore } from '../../stores/company-info.store';

@Component({
  selector: 'ne-company-info',
  standalone: true,
  imports: [CommonModule, MatButtonModule, CompanyComponent],
  template: `
    <ne-company
      [isLoading]="isLoading()"
      [compInfo]="compInfo()"
      (handleEditCompInfo)="onEditCompProfile($event)"
    ></ne-company>
  `,
  styleUrl: './company-info.component.scss',
  providers: [CompanyInfoStore],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CompanyInfoComponent {
  #compInfoStore = inject(CompanyInfoStore);

  compInfo = this.#compInfoStore.companyInfo;
  isLoading = this.#compInfoStore.isLoading;
  constructor() {
    effect(
      () => {
        if (this.#compInfoStore.isLoading() === COMP_INFO_LOADING.REFRESH) {
          this.#compInfoStore.getCompanyProfile();
        }
      },
      { allowSignalWrites: true }
    );
  }

  onEditCompProfile = (event: IEditCompanyProfileReq) => {
    this.#compInfoStore.editCompanyProfile(event);
  };
}
