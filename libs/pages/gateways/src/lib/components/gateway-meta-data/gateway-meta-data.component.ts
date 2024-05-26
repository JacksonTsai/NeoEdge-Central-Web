import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, computed, inject, input } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  UntypedFormArray,
  UntypedFormControl,
  UntypedFormGroup,
  Validators
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { SafePipe } from '@neo-edge-web/directives';
import { BOOLEAN_STATUS, TMetaData } from '@neo-edge-web/models';

@Component({
  selector: 'ne-gateway-meta-data',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatInputModule, MatButtonModule, SafePipe],
  templateUrl: './gateway-meta-data.component.html',
  styleUrl: './gateway-meta-data.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GatewayMetaDataComponent implements OnInit {
  metaData = input<TMetaData>();
  booleanStatus = BOOLEAN_STATUS;
  #fb = inject(FormBuilder);
  form!: UntypedFormGroup;

  get nameCtrl() {
    return this.form.get('name') as UntypedFormControl;
  }

  get longitudeCtrl() {
    return this.form.get('longitude') as UntypedFormControl;
  }

  get latitudeCtrl() {
    return this.form.get('latitude') as UntypedFormControl;
  }

  get vendorIconPathCtrl() {
    return this.form.get('vendorIconPath') as UntypedFormControl;
  }

  get ipcVendorNameCtrl() {
    return this.form.get('ipcVendorName') as UntypedFormControl;
  }

  get ipcModelNameCtrl() {
    return this.form.get('ipcModelName') as UntypedFormControl;
  }

  get ipcSerialPortsArr() {
    return this.form.get('ipcSerialPorts') as UntypedFormArray;
  }

  get labelsArr() {
    return this.form.get('labels') as UntypedFormArray;
  }

  get customFieldArr() {
    return this.form.get('customField') as UntypedFormArray;
  }

  partnerLogoPath = computed(() => {
    return `/assets/images/${this.metaData().ipcVendorName?.toLowerCase()}_logo.png`;
  });

  ngOnInit() {
    this.form = this.#fb.group({
      name: [{ value: '', disabled: true }, [Validators.required]],
      longitude: [{ value: '', disabled: true }, [Validators.required]],
      latitude: [{ value: '', disabled: true }, [Validators.required]],
      vendorIconPath: [{ value: '', disabled: true }, [Validators.required]],
      ipcVendorName: [{ value: '', disabled: true }, [Validators.required]],
      ipcModelName: [{ value: '', disabled: true }, [Validators.required]],
      ipcSerialPorts: [{ value: '', disabled: true }, [Validators.required]],
      labels: [{ value: '', disabled: true }, [Validators.required]],
      customField: [{ value: '', disabled: true }, [Validators.required]]
    });
  }
}
