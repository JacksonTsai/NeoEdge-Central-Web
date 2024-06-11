import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewChild, computed, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { NeSupportAppsComponent } from '@neo-edge-web/components';
import { ISupportApps, ISupportAppsWithVersion } from '@neo-edge-web/models';

@Component({
  selector: 'ne-create-it-service',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatStepperModule, MatCardModule, NeSupportAppsComponent],
  templateUrl: './create-it-service.component.html',
  styleUrl: './create-it-service.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateItServiceComponent {
  @ViewChild('stepper') private stepper: MatStepper;
  supportApps = input<ISupportApps[]>();

  supportAppsAvailable = computed(() => {
    return this.supportApps()?.filter((v) => v.isAvailable);
  });

  supportAppsUnavailable = computed(() => {
    return this.supportApps()?.filter((v) => !v.isAvailable);
  });

  onAppClick = (payload: ISupportAppsWithVersion): void => {
    this.stepper.next();
  };
}
