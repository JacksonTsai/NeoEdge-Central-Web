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
import { GatewaysService } from '@neo-edge-web/global-service';
import { GATEWAYS_TYPE, IAddGatewayReq } from '@neo-edge-web/models';
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
  gatewayType = GATEWAYS_TYPE;
  partnerIpcNameOpts = this.data.gwStore.partnersIpc().map((d) => d.name);
  isPartnerIpcCtrl = new UntypedFormControl(GATEWAYS_TYPE.PARTNER);
  tableSize = this.data.gwStore.size;
  enrollCommand = signal(null);

  get ipcVendorNameCtrl() {
    return this.form.get('ipcVendorName') as UntypedFormControl;
  }

  get ipcModelNameCtrl() {
    return this.form.get('ipcModelName') as UntypedFormControl;
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
    const ipcName = this.ipcVendorNameCtrl.value ?? '';
    const seriesName = this.ipcModelNameCtrl.value ? this.ipcModelNameCtrl?.value.seriesName : '';
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
    const ipc = this.data.gwStore.partnersIpc().find((d) => d.name === this.ipcVendorNameCtrl.value);
    if (!ipc) {
      return [];
    }
    return ipc.partnerModelSeries.flatMap((series) =>
      series.models.map((model) => ({ seriesName: series.name, model: model.name }))
    );
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
    if (this.form.invalid) {
      return;
    }
    const payload: IAddGatewayReq = {
      ipcModelName: this.ipcModelNameCtrl.value?.model ?? this.ipcModelNameCtrl.value,
      ipcVendorName: this.ipcVendorNameCtrl.value,
      isPartnerIpc: this.isPartnerIpcCtrl.value,
      name: this.nameCtrl.value,
      osId: this.osCtrl.value.id,
      projectId: this.data.gwStore.projectId()
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
    this.form = this.#fb.group({
      ipcVendorName: ['', [Validators.required]],
      ipcModelName: ['', [Validators.required]],
      name: ['', [Validators.required]],
      os: ['', [Validators.required]],
      projectId: [this.data.gwStore.projectId()]
    });

    this.isPartnerIpcCtrl.valueChanges.subscribe(() => {
      this.form.reset();
    });
  }
}
