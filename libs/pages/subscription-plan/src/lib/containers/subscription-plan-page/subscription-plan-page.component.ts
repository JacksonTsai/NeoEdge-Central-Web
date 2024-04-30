import { AsyncPipe, DOCUMENT, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';
import * as AuthStore from '@neo-edge-web/auth-store';
import { UntilDestroy } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { SubscriptionPlanComponent } from '../../components';
import { SubscriptionPlanStore } from '../../stores/subscription-plan.store';

@UntilDestroy()
@Component({
  standalone: true,
  imports: [SubscriptionPlanComponent, AsyncPipe, NgIf, MatDialogModule],
  template: `
    <ng-container *ngIf="userProfile$ | async as user">
      <ne-subscription-plan
        [currentPlan]="currentPlan()"
        [userProfile]="user.userProfile"
        [isLoading]="isLoading()"
        (handleSendEmail)="onSendMail($event)"
        (handlePlansComparation)="onPlansComparation($event)"
      ></ne-subscription-plan>
    </ng-container>
  `,
  styleUrl: './subscription-plan-page.component.scss',
  providers: [SubscriptionPlanStore],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SubscriptionPlanPageComponent {
  readonly subscriptionStore = inject(SubscriptionPlanStore);
  #globalStore = inject(Store);
  #router = inject(Router);
  document: Document = inject(DOCUMENT);
  userProfile$ = this.#globalStore.select(AuthStore.selectUserProfile);
  currentPlan = this.subscriptionStore.currentPlan;
  isLoading = this.subscriptionStore.isLoading;
  onSendMail = (payload) => {
    this.subscriptionStore.upgradePlan({ payload });
  };

  onPlansComparation = () => {
    const link = this.document.createElement('a');
    link.target = '_blank';
    link.href =
      'https://www.ecloudvalley.com/new-site/page-preview/1709613795301072?viewCode=254baa5aa0256a69469eebde34dab76f';
    link.click();
    link.remove();
  };
}
