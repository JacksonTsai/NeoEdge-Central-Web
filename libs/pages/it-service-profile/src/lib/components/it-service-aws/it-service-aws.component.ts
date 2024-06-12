import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject, input } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ItServiceDetailService } from '@neo-edge-web/global-services';
import {
  IItServiceConnectionOption,
  IItServiceQoSOption,
  ISupportAppsWithVersion,
  IT_SERVICE_DETAIL_MODE
} from '@neo-edge-web/models';

@Component({
  selector: 'ne-it-service-aws',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ],
  templateUrl: './it-service-aws.component.html',
  styleUrl: './it-service-aws.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItServiceAwsComponent implements OnInit {
  mode = input<IT_SERVICE_DETAIL_MODE>(IT_SERVICE_DETAIL_MODE.CREATE);
  appSettings = input<ISupportAppsWithVersion>();
  itServiceDetailService = inject(ItServiceDetailService);
  #fb = inject(FormBuilder);
  form: UntypedFormGroup;

  connectionOpts: IItServiceConnectionOption[];
  qoSOps: IItServiceQoSOption[] = [{ value: 0 }, { value: 1, selected: true }];

  get nameCtrl() {
    return this.form.get('name') as UntypedFormControl;
  }

  get hostCtrl() {
    return this.form.get('host') as UntypedFormControl;
  }

  get connectionCtrl() {
    return this.form.get('connection') as UntypedFormControl;
  }

  get keepAliveCtrl() {
    return this.form.get('keepAlive') as UntypedFormControl;
  }

  get qoSCtrl() {
    return this.form.get('qoS') as UntypedFormControl;
  }

  get caCertFileCtrl() {
    return this.form.get('caCertFile') as UntypedFormControl;
  }

  setFormValue = (): void => {
    this.form.setValue({
      name: null,
      host: null,
      connection: null,
      keepAlive: 60,
      qoS: 1,
      caCertFile: null
    });
  };

  getQoSTooltipText = (): string => {
    return this.itServiceDetailService.getQoSTooltipText([0, 1]);
  };

  onChange(): void {
    console.log('onChange');
  }

  ngOnInit(): void {
    this.connectionOpts = this.itServiceDetailService.getConnection(this.appSettings()?.key);
    const defaultConnection = this.connectionOpts.find((conn) => conn.default);

    this.form = this.#fb.group({
      name: ['', [Validators.required]],
      host: ['', [Validators.required]],
      connection: [defaultConnection?.value ?? null, [Validators.required]],
      keepAlive: [60, [Validators.required]],
      qoS: [1, [Validators.required]],
      caCertFile: [null]
    });
  }
}
