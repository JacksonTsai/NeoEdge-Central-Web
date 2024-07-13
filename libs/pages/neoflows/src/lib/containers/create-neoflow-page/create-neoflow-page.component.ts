import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, ViewChild, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { OtDevicesService, SupportAppsService } from '@neo-edge-web/global-services';
import { CREATE_NEOFLOW_STEP, SUPPORT_APPS_OT_DEVICE } from '@neo-edge-web/models';
import { generateThreeCharUUID } from '@neo-edge-web/utils';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { AddNewOtDeviceDialogComponent } from '../../components/add-new-ot-device-dialog/add-new-ot-device-dialog.component';
import { AddOtDeviceProfileDialogComponent } from '../../components/add-ot-device-profile-dialog/add-ot-device-profile-dialog.component';
import { CreateMessageSchemaComponent } from '../../components/create-message-schema/create-message-schema.component';
import { MessageLinkDatasourceComponent } from '../../components/message-link-datasource/message-link-datasource.component';
import { MessageLinkDestinationComponent } from '../../components/message-link-destination/message-link-destination.component';
import { NeoflowProfileComponent } from '../../components/neoflow-profile/neoflow-profile.component';
import { OtDeviceDetailDialogComponent } from '../../components/ot-device-detail-dialog/ot-device-detail-dialog.component';
import { SelectDataProviderComponent } from '../../components/select-data-provider/select-data-provider.component';
import { SelectMessageDestinationComponent } from '../../components/select-message-destination/select-message-destination.component';
import { CreateNeoFlowsStore } from '../../stores/create-neoflows.store';

@UntilDestroy()
@Component({
  selector: 'ne-create-neoflow-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatStepperModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    CreateMessageSchemaComponent,
    MessageLinkDatasourceComponent,
    MessageLinkDestinationComponent,
    NeoflowProfileComponent,
    SelectMessageDestinationComponent,
    SelectDataProviderComponent
  ],
  templateUrl: './create-neoflow-page.component.html',
  styleUrl: './create-neoflow-page.component.scss',
  providers: [CreateNeoFlowsStore],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateNeoflowPageComponent implements OnInit {
  @ViewChild('stepper') stepper: MatStepper;
  #fb = inject(FormBuilder);
  #createNeoFlowStore = inject(CreateNeoFlowsStore);
  #dialog = inject(MatDialog);
  #supportAppService = inject(SupportAppsService);
  #otDevicesService = inject(OtDevicesService);

  form: UntypedFormGroup;
  processorVerOpt = this.#createNeoFlowStore.neoflowProcessorVers;
  addedOt = this.#createNeoFlowStore.addedOt;
  addedIt = this.#createNeoFlowStore.addedIt;
  texolTagDoc = this.#createNeoFlowStore.texolTagDoc;

  get currentStepperId() {
    return this.stepper?.selectedIndex ?? 0;
  }

  get stepperName() {
    return CREATE_NEOFLOW_STEP[this.currentStepperId];
  }

  get createDisabled() {
    return false;
  }

  get nextBtnDisabled() {
    if (this.stepper) {
      return this.form.get(this.stepperName).invalid;
    }
    return false;
  }

  isRtuProfile(appName) {
    return SUPPORT_APPS_OT_DEVICE.MODBUS_RTU === appName;
  }

  isTexolProfile(appName) {
    return SUPPORT_APPS_OT_DEVICE.TEXOL213MM2R1 === appName;
  }

  isTcpProfile(appName) {
    return SUPPORT_APPS_OT_DEVICE.MODBUS_TCP === appName;
  }

  onBackStep = () => {
    this.stepper.previous();
  };

  onNextStep = () => {
    this.stepper.next();
  };

  isExistAddedOtList = (otProfile) => {
    return this.#createNeoFlowStore?.addedOt()?.findIndex((d) => d.name.trim() === otProfile.name.trim()) > -1
      ? true
      : false;
  };

  addNewDeviceToList = (otProfile) => {
    const { name: appClass, id: appId } = this.#supportAppService.getAppVersionData(
      otProfile.appVersionId,
      this.#createNeoFlowStore.supportApps()
    );

    const otProfileTemp = { ...otProfile };
    if (this.isExistAddedOtList(otProfileTemp)) {
      const rename = `${otProfileTemp.name}_${generateThreeCharUUID(3)}`;
      const { name: appName } = this.#supportAppService.getAppVersionData(
        otProfileTemp.appVersionId,
        this.#createNeoFlowStore.supportApps()
      );

      switch (appName) {
        case SUPPORT_APPS_OT_DEVICE.MODBUS_TCP:
          otProfileTemp.setting.Instances.TCP[0].Devices[0].Name = rename;
          break;
        case SUPPORT_APPS_OT_DEVICE.MODBUS_RTU:
          otProfileTemp.setting.Instances.RTU[0].Devices[0].Name = rename;
          break;
        case SUPPORT_APPS_OT_DEVICE.TEXOL213MM2R1:
          otProfileTemp.setting.Instances.RTU[0].Devices[0].Name = rename;
          break;
      }
      otProfileTemp.name = rename;
    }

    this.#createNeoFlowStore.addOtDevice({
      ...otProfileTemp,
      appClass,
      appId,
      createdAt: Date.now() / 1000,
      createdBy: this.#createNeoFlowStore.userProfile().name
    });
  };

  onAddNewDevice = () => {
    let addNewOtDeviceDialogRef = this.#dialog.open(AddNewOtDeviceDialogComponent, {
      panelClass: 'lg-dialog',
      disableClose: true,
      autoFocus: false,
      restoreFocus: false
    });

    const componentInstance = addNewOtDeviceDialogRef.componentInstance;

    componentInstance.createNewOtDevice.pipe(untilDestroyed(this)).subscribe((ot) => {
      this.addNewDeviceToList(ot.profile);
    });

    componentInstance.createAndSaveOtDevice.pipe(untilDestroyed(this)).subscribe((ot) => {
      this.#otDevicesService
        .createOtDevice$({ profile: ot.profile, deviceIcon: ot?.deviceProfile?.deviceIcon })
        .subscribe();

      this.addNewDeviceToList(ot.profile);
    });

    addNewOtDeviceDialogRef
      .afterClosed()
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        addNewOtDeviceDialogRef = undefined;
      });
  };

  onAddDeviceFromProfile = () => {
    let addOtDeviceProfileDialogRef = this.#dialog.open(AddOtDeviceProfileDialogComponent, {
      panelClass: 'lg-dialog',
      disableClose: true,
      autoFocus: false,
      restoreFocus: false
    });

    const componentInstance = addOtDeviceProfileDialogRef.componentInstance;
    componentInstance.handleAddOtDevice.pipe(untilDestroyed(this)).subscribe((otProfile) => {
      this.addNewDeviceToList(otProfile);
    });

    addOtDeviceProfileDialogRef
      .afterClosed()
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        addOtDeviceProfileDialogRef = undefined;
      });
  };

  onRemoveDeviceFromNeoFlow = ({ otDeviceName }) => {
    this.#createNeoFlowStore.removeOtDevice({ otDeviceName });
  };

  onDetailDeviceFromNeoFlow = (event) => {
    const { name: appName } = this.#supportAppService.getAppVersionData(
      event.appVersionId,
      this.#createNeoFlowStore.supportApps()
    );

    let detailOtDeviceProfileDialogRef = this.#dialog.open(OtDeviceDetailDialogComponent, {
      panelClass: 'lg-dialog',
      disableClose: true,
      autoFocus: false,
      restoreFocus: false,
      data: { otDevice: event, appName, texolTagDoc: this.texolTagDoc() }
    });

    const componentInstance = detailOtDeviceProfileDialogRef.componentInstance;
    componentInstance.handleEditOtDevice.pipe(untilDestroyed(this)).subscribe((otProfile) => {
      this.#createNeoFlowStore.editOtDevice(otProfile);
    });

    detailOtDeviceProfileDialogRef
      .afterClosed()
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        detailOtDeviceProfileDialogRef = undefined;
      });
  };

  onCreateNeoFlow = () => {
    console.log('create');
  };

  ngOnInit() {
    this.form = this.#fb.group({
      profile: [],
      selectDataProvider: []
    });
  }
}
