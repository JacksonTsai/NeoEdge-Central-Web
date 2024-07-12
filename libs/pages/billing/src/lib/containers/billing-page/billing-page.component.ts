import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { BILLING_TOTAL_TYPE } from '@neo-edge-web/models';
import { BillingComponent } from '../../components';
import { BillingTotalComponent } from '../../components/billing-total/billing-total.component';
import { BillingdStore } from '../../stores';

@Component({
  selector: 'ne-billing-page',
  standalone: true,
  imports: [CommonModule, BillingComponent, BillingTotalComponent],
  templateUrl: './billing-page.component.html',
  styleUrl: './billing-page.component.scss',
  providers: [BillingdStore],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BillingPageComponent {
  #billingdStore = inject(BillingdStore);
  timeRecord = this.#billingdStore.timeRecord;
  estimate = this.#billingdStore.estimate;
  billingTotalType = BILLING_TOTAL_TYPE;
}
