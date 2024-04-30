import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Output, effect, input } from '@angular/core';
import { ReactiveFormsModule, UntypedFormControl, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {
  IGetSubscriptionResp,
  IGetUserProfileResp,
  IUpgradePlanReq,
  SUBSCRIPTION_LOADING,
  SUBSCRIPTION_PLAN
} from '@neo-edge-web/models';
import { datetimeFormat } from '@neo-edge-web/utils';
@Component({
  selector: 'ne-subscription-plan',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule
  ],
  templateUrl: './subscription-plan.component.html',
  styleUrl: './subscription-plan.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SubscriptionPlanComponent {
  @Output() handleSendEmail = new EventEmitter<IUpgradePlanReq>();
  @Output() handlePlansComparation = new EventEmitter();

  currentPlan = input<IGetSubscriptionResp>(null);
  userProfile = input<IGetUserProfileResp>(null);
  isLoading = input<SUBSCRIPTION_LOADING>(SUBSCRIPTION_LOADING.NONE);
  subscriptionLoading = SUBSCRIPTION_LOADING;
  subscriptionPlan = SUBSCRIPTION_PLAN;
  emailContentCtrl = new UntypedFormControl('', [Validators.required, Validators.maxLength(1024)]);
  emailContentInit = '';

  constructor() {
    effect(() => {
      if (this.currentPlan()?.planId && this.currentPlan().planId < 4) {
        this.emailContentCtrl.setValue(
          `I would like to upgrade NeoEdge Central to ${
            SUBSCRIPTION_PLAN[this.currentPlan().planId + 1]
          } plan. Please Contact with me.`
        );
      }
    });
  }

  getFormatDate(timestamp: number) {
    return isNaN(timestamp) ? '-' : datetimeFormat(timestamp);
  }

  sendEmail = () => {
    if (this.emailContentCtrl.value) {
      this.handleSendEmail.emit({
        requester: `${this.userProfile().name}, ${this.userProfile().account}`,
        message: this.emailContentCtrl.value,
        planId: this.currentPlan().planId + 1
      });
    }
  };

  plansComparation = () => {
    this.handlePlansComparation.emit();
  };
}
