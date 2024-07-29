import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, ViewChild, computed, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { NeoFlowNodeComponent } from '@neo-edge-web/components';
import {
  ItServiceDetailService,
  ItServiceService,
  OtDevicesService,
  SupportAppsService
} from '@neo-edge-web/global-services';
import {
  CREATE_NEOFLOW_STEP,
  IItService,
  SUPPORT_APPS_FLOW_GROUPS,
  SUPPORT_APPS_OT_DEVICE
} from '@neo-edge-web/models';
import { generateThreeCharUUID } from '@neo-edge-web/utils';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { map } from 'rxjs';
import { AddItServiceProfileDialogComponent } from '../../components/add-it-service-profile-dialog/add-it-service-profile-dialog.component';
import { AddNewItServiceDialogComponent } from '../../components/add-new-it-service-dialog/add-new-it-service-dialog.component';
import { AddNewOtDeviceDialogComponent } from '../../components/add-new-ot-device-dialog/add-new-ot-device-dialog.component';
import { AddOtDeviceProfileDialogComponent } from '../../components/add-ot-device-profile-dialog/add-ot-device-profile-dialog.component';
import { CreateMessageSchemaComponent } from '../../components/create-message-schema/create-message-schema.component';
import { ItServiceDetailDialogComponent } from '../../components/it-service-detail-dialog/it-service-detail-dialog.component';
import { MessageLinkDataSourceComponent } from '../../components/message-link-datasource/message-link-datasource.component';
import { MessageLinkDestinationComponent } from '../../components/message-link-destination/message-link-destination.component';
import { NeoflowProfileComponent } from '../../components/neoflow-profile/neoflow-profile.component';
import { OtDeviceDetailDialogComponent } from '../../components/ot-device-detail-dialog/ot-device-detail-dialog.component';
import { SelectDataProviderComponent } from '../../components/select-data-provider/select-data-provider.component';
import { SelectMessageDestinationComponent } from '../../components/select-message-destination/select-message-destination.component';
import { CreateNeoFlowsStore } from '../../stores/create-neoflows.store';
import { MessageLinkDataSourcePageComponent } from '../message-link-datasource-page/message-link-datasource-page.component';

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
    NeoflowProfileComponent,
    SelectDataProviderComponent,
    NeoFlowNodeComponent,
    CreateMessageSchemaComponent,
    MessageLinkDataSourceComponent,
    MessageLinkDestinationComponent,
    MessageLinkDataSourcePageComponent,
    SelectMessageDestinationComponent
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
  #supportAppsService = inject(SupportAppsService);
  #otDevicesService = inject(OtDevicesService);
  #itServiceDetailService = inject(ItServiceDetailService);
  #itServiceService = inject(ItServiceService);

  processorVer = computed(() => {
    return this.#createNeoFlowStore?.neoflowProfile()?.neoFlowDataProcessorVer?.version ?? 'default';
  });

  form: UntypedFormGroup;
  processorVerOpt = this.#createNeoFlowStore.neoflowProcessorVers;
  addedOt = this.#createNeoFlowStore.addedOt;
  addedIt = this.#createNeoFlowStore.addedIt;
  addedMessageSchema = this.#createNeoFlowStore.addedMessageSchema;
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
      switch (this.currentStepperId) {
        case CREATE_NEOFLOW_STEP.neoflowProfile:
          return this.form.get(this.stepperName).invalid;
        case CREATE_NEOFLOW_STEP.selectDataProvider:
          return this.#createNeoFlowStore.addedOt()?.length > 0 ? false : true;
        case CREATE_NEOFLOW_STEP.selectMessageDestination:
          return this.#createNeoFlowStore.addedIt()?.length > 0 ? false : true;
        case CREATE_NEOFLOW_STEP.createMessageSchema:
          return this.form.get(this.stepperName).invalid;
        case CREATE_NEOFLOW_STEP.linkDataSource:
          return this.#createNeoFlowStore.dsToMessageConnection()?.length > 0 ? false : true;
      }
    }
    return false;
  }

  get neoflowProfileCtrl() {
    return this.form.get('neoflowProfile') as UntypedFormControl;
  }

  get createMessageSchemaCtrl() {
    return this.form.get('createMessageSchema') as UntypedFormControl;
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

  isExistAddedItList = (itService) => {
    return this.#createNeoFlowStore?.addedIt()?.findIndex((d) => d.name.trim() === itService.name.trim()) > -1
      ? true
      : false;
  };

  addNewDeviceToList = (otProfile) => {
    const { name: appClass, id: appId } = this.#supportAppsService.getAppVersionData(
      otProfile.appVersionId,
      this.#createNeoFlowStore.supportApps()
    );

    const otProfileTemp = { ...otProfile };
    if (this.isExistAddedOtList(otProfileTemp)) {
      const rename = `${otProfileTemp.name}_${generateThreeCharUUID(3)}`;
      const { name: appName } = this.#supportAppsService.getAppVersionData(
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
      createdAt: otProfileTemp?.createdAt ?? Date.now() / 1000,
      createdBy: otProfileTemp?.createdBy ?? this.#createNeoFlowStore.userProfile().name
    });
  };

  addNewItServiceToList = (itService: IItService) => {
    const { name: appClass, id: appId } = this.#supportAppsService.getAppVersionData(
      itService.appVersionId,
      this.#createNeoFlowStore.supportApps()
    );

    const itServiceTemp: IItService = { ...itService };

    if (this.isExistAddedItList(itServiceTemp)) {
      const rename = `${itServiceTemp.name}_${generateThreeCharUUID(3)}`;
      itServiceTemp.setting.Instances[0].name = rename;
      itServiceTemp.name = rename;
    }

    const { connection } = this.#itServiceDetailService.apiToFieldData(itServiceTemp);
    const connectionOpts = this.#itServiceDetailService.getConnection();

    if (connection) {
      let connectionLabel = connectionOpts.find((v) => v.value === connection)?.label;
      if (!connectionLabel) {
        connectionLabel = itServiceTemp.appVersionId === 3 ? `MQTT(${connection})` : `HTTP(${connection})`;
      }
      itServiceTemp.connectionLabel = connectionLabel;
    }

    this.#createNeoFlowStore.addItService({
      ...itServiceTemp,
      appClass,
      appId,
      createdAt: itService?.createdAt ?? Date.now() / 1000,
      createdBy: itService?.createdBy ?? this.#createNeoFlowStore.userProfile().name,
      type:
        itServiceTemp?.type ??
        this.#supportAppsService.getAppVersionData(itServiceTemp.appVersionId, this.#createNeoFlowStore.supportApps())
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
    const { name: appName } = this.#supportAppsService.getAppVersionData(
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

  onAddItServiceFromProfile = () => {
    let addItServiceProfileDialogRef = this.#dialog.open(AddItServiceProfileDialogComponent, {
      panelClass: 'lg-dialog',
      disableClose: true,
      autoFocus: false,
      restoreFocus: false
    });

    const componentInstance = addItServiceProfileDialogRef.componentInstance;
    componentInstance.handleAddItServiceToNeoFlow.pipe(untilDestroyed(this)).subscribe((itService) => {
      this.addNewItServiceToList(itService);
    });

    addItServiceProfileDialogRef
      .afterClosed()
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        addItServiceProfileDialogRef = undefined;
      });
  };

  onRemoveItServiceFromNeoFlow = (event) => {
    this.#createNeoFlowStore.removeItService({ itServiceName: event.name });
  };

  onDetailItServiceFromNeoFlow = (event) => {
    let detailItServiceFromNeoFlowRef = this.#dialog.open(ItServiceDetailDialogComponent, {
      panelClass: 'lg-dialog',
      disableClose: true,
      autoFocus: false,
      restoreFocus: false,
      data: {
        itServiceDetail: event,
        supportApps: this.#createNeoFlowStore
          .supportApps()
          .filter((d) => d.flowGroup === SUPPORT_APPS_FLOW_GROUPS.it_service)
      }
    });

    const componentInstance = detailItServiceFromNeoFlowRef.componentInstance;
    componentInstance.handleSaveItServiceToNeoFlow.pipe(untilDestroyed(this)).subscribe((itService) => {
      this.#createNeoFlowStore.editItService({ source: event, target: itService });
    });

    detailItServiceFromNeoFlowRef
      .afterClosed()
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        detailItServiceFromNeoFlowRef = undefined;
      });
  };

  onAddNewItService = () => {
    let addItServiceProfileDialogRef = this.#dialog.open(AddNewItServiceDialogComponent, {
      panelClass: 'lg-dialog',
      disableClose: true,
      autoFocus: false,
      restoreFocus: false
    });

    const componentInstance = addItServiceProfileDialogRef.componentInstance;
    componentInstance.createNewItService.pipe(untilDestroyed(this)).subscribe((it) => {
      this.addNewItServiceToList(it);
    });

    componentInstance.createAndSaveItService.pipe(untilDestroyed(this)).subscribe((it) => {
      this.#itServiceService.createItService$(it).subscribe();
      this.addNewItServiceToList(it);
    });

    addItServiceProfileDialogRef
      .afterClosed()
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        addItServiceProfileDialogRef = undefined;
      });
  };

  onCreateNeoFlow = () => {
    console.log('create');
  };

  ngOnInit() {
    this.form = this.#fb.group({
      neoflowProfile: [],
      createMessageSchema: []
    });

    this.neoflowProfileCtrl.valueChanges
      .pipe(
        untilDestroyed(this),
        map((neoflowProfile) => {
          this.#createNeoFlowStore.updateNeoFlowProfile(neoflowProfile);
        })
      )
      .subscribe();

    this.createMessageSchemaCtrl.valueChanges
      .pipe(
        untilDestroyed(this),
        map((messageSchema) => {
          this.#createNeoFlowStore.updateMessageSchema(messageSchema);
        })
      )
      .subscribe();
  }
}
