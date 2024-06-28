import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GatewaysService } from '@neo-edge-web/global-services';
import { GATEWAYS_TYPE, IAddGatewayReq } from '@neo-edge-web/models';
import { whitespaceValidator } from '@neo-edge-web/validators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { take, tap } from 'rxjs';
import { GatewaysStore } from '../../stores/gateways.store';

@UntilDestroy()
@Component({
  selector: 'ne-add-gateway-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatSelectModule,
    MatIconModule
  ],
  templateUrl: './add-gateway-dialog.component.html',
  styleUrl: './add-gateway-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddGatewayDialogComponent implements OnInit {
  dialogRef!: MatDialogRef<AddGatewayDialogComponent>;
  data = inject<{ gwStore: GatewaysStore; gwService: GatewaysService }>(MAT_DIALOG_DATA);
  #snackBar = inject(MatSnackBar);
  #fb = inject(FormBuilder);
  form!: UntypedFormGroup;
  otherForm!: UntypedFormGroup;
  partnerForm!: UntypedFormGroup;
  gatewayType = GATEWAYS_TYPE;
  partnerIpcNameOpts = this.data.gwStore.partnersIpc().map((d) => d.name);
  isPartnerIpcCtrl = new UntypedFormControl(GATEWAYS_TYPE.PARTNER);
  tableSize = this.data.gwStore.size;
  enrollCommand = signal(null);

  get gatewayLogo() {
    if (!this.partnerIpcVendorNameCtrl.value || !this.partnerIpcModelNameCtrl.value || !this.isPartnerIpcCtrl.value) {
      return '/assets/images/default_gateway.png';
    }
    console.log(this.partnerIpcModelNameCtrl.value);

    if (this.partnerIpcVendorNameCtrl.value && this.partnerIpcModelNameCtrl.value) {
      return `/assets/images/default_${this.partnerIpcVendorNameCtrl.value.toLowerCase()}_${this.partnerIpcModelNameCtrl.value.model}.png`;
    }

    return '/assets/images/default_gateway.png';
  }

  get partnerIpcVendorNameCtrl() {
    return this.partnerForm.get('ipcVendorName') as UntypedFormControl;
  }

  get partnerIpcModelNameCtrl() {
    return this.partnerForm.get('ipcModelName') as UntypedFormControl;
  }

  get otherIpcVendorNameCtrl() {
    return this.otherForm.get('ipcVendorName') as UntypedFormControl;
  }

  get otherIpcModelNameCtrl() {
    return this.otherForm.get('ipcModelName') as UntypedFormControl;
  }

  get nameCtrl() {
    return this.form.get('name') as UntypedFormControl;
  }

  get osCtrl() {
    return this.form.get('os') as UntypedFormControl;
  }

  get isPartner() {
    return GATEWAYS_TYPE.PARTNER === this.isPartnerIpcCtrl.value ? true : false;
  }

  get partnerIpcOpt() {
    return this.data.gwStore.partnersIpc().map((d) => d.name);
  }

  get partnerOsBySeries() {
    const ipcName = this.partnerIpcVendorNameCtrl.value ?? '';
    const seriesName = this.partnerIpcModelNameCtrl.value ? this.partnerIpcModelNameCtrl?.value.seriesName : '';
    if (!ipcName || !seriesName) {
      return [];
    }
    return (
      this.data.gwStore
        .partnersIpc()
        ?.find((d) => d.name === ipcName)
        ?.partnerModelSeries?.find((v) => v?.name === seriesName)?.oss ?? []
    );
  }

  get otherIpcOs() {
    return this.data.gwStore.customOs();
  }

  get osOpts() {
    if (this.isPartner) {
      return this.partnerOsBySeries;
    } else {
      return this.otherIpcOs;
    }
  }

  get partnerModelByIpcOpts() {
    const ipc = this.data.gwStore.partnersIpc().find((d) => d.name === this.partnerIpcVendorNameCtrl.value);
    if (!ipc) {
      return [];
    }
    return ipc.partnerModelSeries.flatMap((series) =>
      series.models.map((model) => ({ seriesName: series.name, model: model.name }))
    );
  }

  get isFormInvalid() {
    return this.isPartner ? this.partnerForm.invalid || this.form.invalid : this.otherForm.invalid || this.form.invalid;
  }

  copyCommand = () => {
    if (this.enrollCommand()?.command) {
      navigator.clipboard.writeText(this.enrollCommand().command);
      this.#snackBar.open('Copied Command.', 'X', {
        horizontalPosition: 'end',
        verticalPosition: 'bottom',
        duration: 5000
      });
    }
  };

  onClose = () => {
    this.dialogRef.close();
  };

  onSubmit = () => {
    const formInvalid = this.isPartner ? this.partnerForm.invalid : this.otherForm.invalid;
    if (formInvalid) {
      return;
    }

    const payload: IAddGatewayReq = {
      ipcModelName: this.isPartner ? this.partnerIpcModelNameCtrl.value?.model : this.otherIpcModelNameCtrl.value,
      ipcVendorName: this.isPartner ? this.partnerIpcVendorNameCtrl.value : this.otherIpcVendorNameCtrl.value,
      isPartnerIpc: this.isPartnerIpcCtrl.value,
      name: this.nameCtrl.value,
      osId: this.osCtrl.value.id
    };

    this.data.gwService
      .addGateway$(payload)
      .pipe(
        untilDestroyed(this),
        take(1),
        tap((resp) => {
          this.data.gwStore.queryGatewayTableByPage({ size: this.tableSize() });
          this.enrollCommand.set({ ...resp, ...payload });
        })
      )
      .subscribe();
  };

  ngOnInit() {
    this.partnerForm = this.#fb.group({
      ipcVendorName: ['', [Validators.required, whitespaceValidator]],
      ipcModelName: ['', [Validators.required, whitespaceValidator]]
    });

    this.otherForm = this.#fb.group({
      ipcVendorName: ['', [Validators.required, whitespaceValidator]],
      ipcModelName: ['', [Validators.required, whitespaceValidator]]
    });

    this.form = this.#fb.group({
      name: ['', [Validators.required, whitespaceValidator]],
      os: ['', [Validators.required]]
    });

    this.isPartnerIpcCtrl.valueChanges.subscribe(() => {
      this.partnerForm.reset();
      this.otherForm.reset();
      this.form.reset();
    });

    this.partnerIpcVendorNameCtrl.valueChanges.subscribe(() => {
      this.partnerIpcModelNameCtrl.setValue('');
    });
  }
}
