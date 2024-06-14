import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IItServiceDetail } from '@neo-edge-web/models';
import { ItServiceDetailComponent } from '../../components';
import { ItServiceStore } from '../../stores/it-service.store';

@Component({
  selector: 'ne-it-service-detail-page',
  standalone: true,
  imports: [CommonModule, ItServiceDetailComponent],
  template: ` <ne-it-service-detail></ne-it-service-detail> `,
  styleUrl: './it-service-detail-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItServiceDetailPageComponent {
  route: ActivatedRoute = inject(ActivatedRoute);
  #itServiceStore = inject(ItServiceStore);
  detailData: IItServiceDetail;

  constructor() {
    const itServiceId = parseInt(this.route.snapshot.params['id'], 10);
    // this.housingService.getHousingLocationById(housingLocationId).then((housingLocation) => {
    //   this.housingLocation.set(housingLocation);
    // })
  }
}
