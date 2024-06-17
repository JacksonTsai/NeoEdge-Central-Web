import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BOOLEAN_STATUS, IRebootReq } from '@neo-edge-web/models';
import { UntilDestroy } from '@ngneat/until-destroy';
import { tap } from 'rxjs';
import { GatewayDetailStore } from '../../stores/gateway-detail.store';

@UntilDestroy()
@Component({
  selector: 'ne-gateway-reboot-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule
  ],
  templateUrl: './gateway-reboot-dialog.component.html',
  styleUrl: './gateway-reboot-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GatewayRebootDialogComponent implements OnInit {
  dialogRef!: MatDialogRef<GatewayRebootDialogComponent>;
  data = inject<{ gwDetailStore: GatewayDetailStore }>(MAT_DIALOG_DATA);
  #fb = inject(FormBuilder);
  daysForm: UntypedFormGroup;
  timeForm: UntypedFormGroup;
  rebootNowCtrl = new UntypedFormControl(false);
  hourlyOpts = Array.from({ length: 24 }, (_, i) => i);
  minOpts = Array.from({ length: 60 / 5 }, (_, i) => {
    return i * 5;
  });

  rebootSchedule = this.data.gwDetailStore.gatewayDetail().rebootSchedule;
  timeZone = this.data.gwDetailStore.gatewayDetail().gatewaySystemInfo.timeZone;

  get hourCtrl() {
    return this.timeForm.get('hour') as UntypedFormControl;
  }

  get minCtrl() {
    return this.timeForm.get('min') as UntypedFormControl;
  }

  onSubmit = () => {
    const daySchedule: any = Object.entries(this.daysForm.value).reduce((acc, [key, value]) => {
      acc[key] = value ? 1 : 0;
      return acc;
    }, {});
    const rebootSchedule: IRebootReq = {
      rebootSchedule: {
        days: daySchedule,
        hour: this.hourCtrl.value,
        min: this.minCtrl.value
      },
      rebootNow: this.rebootNowCtrl.value ? 1 : 0
    };

    this.data.gwDetailStore.rebootSchedule({ rebootSchedule });
  };

  setFormData = () => {
    Object.entries(this.rebootSchedule.days).map(([key, value]) => {
      this.daysForm.get(key).setValue(BOOLEAN_STATUS.TRUE === value ? true : false);
    });
    this.hourCtrl.setValue(this.rebootSchedule.hour);
    this.minCtrl.setValue(this.rebootSchedule.min);
    this.timeForm.updateValueAndValidity();
  };

  ngOnInit() {
    this.daysForm = this.#fb.group({
      fri: [false],
      mon: [false],
      sat: [false],
      sun: [false],
      thu: [false],
      tue: [false],
      wed: [false]
    });

    this.timeForm = this.#fb.group({
      hour: [],
      min: []
    });

    this.daysForm.valueChanges
      .pipe(
        tap((d) => {
          const isSchedule = Object.values(d).find((v) => v);
          if (isSchedule) {
            this.hourCtrl.enable();
            this.minCtrl.enable();
            this.hourCtrl.setValidators([Validators.required, Validators.min(0), Validators.max(24)]);
            this.minCtrl.setValidators([Validators.required, Validators.min(0), Validators.max(60)]);
          } else {
            this.hourCtrl.disable();
            this.minCtrl.disable();
            this.hourCtrl.clearAsyncValidators();
            this.minCtrl.clearAsyncValidators();
          }
          this.timeForm.updateValueAndValidity();
        })
      )
      .subscribe();
    this.setFormData();
  }
}
