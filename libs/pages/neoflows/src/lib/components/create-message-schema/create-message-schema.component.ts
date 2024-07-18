import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  forwardRef,
  inject,
  input,
  OnInit
} from '@angular/core';
import {
  ControlValueAccessor,
  FormBuilder,
  FormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  UntypedFormArray,
  UntypedFormControl,
  UntypedFormGroup,
  Validator,
  Validators
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { SupportAppsService } from '@neo-edge-web/global-services';
import { IOtDevice, SUPPORT_APPS_OT_DEVICE } from '@neo-edge-web/models';
import { generateThreeCharUUID } from '@neo-edge-web/utils';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { CreateNeoFlowsStore } from '../../stores/create-neoflows.store';
import { AddTagFromOtDeviceDialogComponent } from '../add-tag-from-ot-device-dialog/add-tag-from-ot-device-dialog.component';
import { MessageSettingComponent } from '../message-setting/message-setting.component';
@UntilDestroy()
@Component({
  selector: 'ne-create-message-schema',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatTabsModule,
    MatIconModule,
    MessageSettingComponent,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule
  ],
  templateUrl: './create-message-schema.component.html',
  styleUrl: './create-message-schema.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CreateMessageSchemaComponent),
      multi: true
    },
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => CreateMessageSchemaComponent), multi: true }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateMessageSchemaComponent implements OnInit, AfterViewInit, ControlValueAccessor, Validator {
  #dialog = inject(MatDialog);
  #fb = inject(FormBuilder);
  #supportAppsService = inject(SupportAppsService);
  #createNeoFlowStore = inject(CreateNeoFlowsStore);
  isEditMode = input(true);
  texolTagDoc = this.#createNeoFlowStore.texolTagDoc;
  displayedColumns = ['no', 'tagName', 'dataClass', 'defaultValue', 'action'];
  form: UntypedFormGroup;
  formArray!: UntypedFormArray;
  change: (value) => void;
  touch: (value) => void;
  #cd = inject(ChangeDetectorRef);

  tabName = (messageId) => {
    if (
      this.messageInfoSettingCtrl(messageId)?.value?.messageName &&
      this.messageInfoSettingCtrl(messageId).value.messageName !== ''
    ) {
      return this.messageInfoSettingCtrl(messageId).value.messageName;
    }

    return 'message';
  };

  messageInfoSettingCtrl = (messageId) => {
    return this.messageGroup(messageId).get('messageInfoSetting') as UntypedFormControl;
  };

  messageGroup = (i: number) => {
    return this.formArray.at(i) as UntypedFormGroup;
  };

  tagNameCtrl(messageId, tagId) {
    return this.getTagsArrayByMessageId(messageId)?.at(tagId)?.get('tagName') as UntypedFormControl;
  }

  dataClassCtrl(messageId, tagId) {
    return this.getTagsArrayByMessageId(messageId)?.at(tagId)?.get('dataClass') as UntypedFormControl;
  }

  defaultValueCtrl(messageId, tagId) {
    return this.getTagsArrayByMessageId(messageId)?.at(tagId)?.get('defaultValue') as UntypedFormControl;
  }

  getTagsArrayByMessageId = (messageId) => {
    return this.messageGroup(messageId)?.get('tags') as UntypedFormArray;
  };

  onCreateMessageSchema = () => {
    this.formArray.push(this.setMessageGroup());
  };

  writeValue(v) {
    console.log(v);
  }

  validate() {
    return this.formArray.length > 0 && this.getTagsArrayByMessageId(0)?.length > 0 && this.formArray.valid
      ? null
      : { formError: 'error' };
  }

  registerOnChange(fn: any) {
    this.change = fn;
  }

  registerOnTouched(fn) {
    this.touch = fn;
  }

  onChange() {
    if (this.change) {
      this.change(this.formArray.value);
    }
  }

  setMessageGroup = () => {
    return new UntypedFormGroup({
      messageId: new UntypedFormControl(generateThreeCharUUID(3)),
      messageInfoSetting: new UntypedFormControl(''),
      tags: new UntypedFormArray([])
    });
  };

  setMessageTagFg = (tagName = '', dataClass = '', defaultValue = '') => {
    return new FormGroup({
      tagName: new UntypedFormControl({ value: tagName, disabled: false }, [Validators.required]),
      dataClass: new UntypedFormControl({ value: dataClass, disabled: false }, [Validators.required]),
      defaultValue:
        dataClass === 'static'
          ? new UntypedFormControl({ value: defaultValue, disabled: false }, [Validators.required])
          : new UntypedFormControl({ value: defaultValue, disabled: false })
    });
  };

  getTagsFromRtuDevice(otDevice: IOtDevice<any>) {
    const deviceCommand = otDevice.setting?.Instances?.RTU[0]?.Devices[0]?.Commands;
    if (deviceCommand) {
      return Object.values(deviceCommand).map((d: any) =>
        this.setMessageTagFg(`${otDevice.name}.${d.Name}`, 'tag', '')
      );
    }
    return [];
  }

  getTagsFromTcpDevice(otDevice: IOtDevice<any>) {
    const deviceCommand = otDevice.setting?.Instances?.TCP[0]?.Devices[0]?.Commands;
    if (deviceCommand) {
      return Object.values(deviceCommand).map((d: any) =>
        this.setMessageTagFg(`${otDevice.name}.${d.Name}`, 'tag', '')
      );
    }
    return [];
  }

  getTagsFromTexol(otDevice: IOtDevice<any>) {
    const deviceCommand = otDevice.setting?.Instances?.RTU[0]?.Devices[0];
    if (deviceCommand.Profile.Name === 'General.profile') {
      const domains = deviceCommand.Profile.Domains;
      const tags = [];
      domains.forEach((d) => {
        tags.push(
          ...this.texolTagDoc()['General'][d].map((v) =>
            this.setMessageTagFg(`${otDevice.name}.${v.TagName}`, 'tag', '')
          )
        );
      });
      return tags;
    } else {
      const profileName = deviceCommand?.Profile?.Name.split('.');

      if (profileName.length === 5) {
        profileName.splice(1, 0, 'NonDriveEnd');
      }

      return this.texolTagDoc()[profileName[0]][profileName[1]][profileName[2]][profileName[4]].map((v) =>
        this.setMessageTagFg(`${otDevice.name}.${v.TagName}`, 'tag', '')
      );
    }
  }

  addTagFromOtDevice = (targetMessageId) => {
    let addOtDeviceTagDialogRef = this.#dialog.open(AddTagFromOtDeviceDialogComponent, {
      panelClass: 'lg-dialog',
      disableClose: true,
      autoFocus: false,
      restoreFocus: false,
      data: { createNeoFlowStore: this.#createNeoFlowStore }
    });

    const componentInstance = addOtDeviceTagDialogRef.componentInstance;
    componentInstance.handleAddOtDeviceTags.pipe(untilDestroyed(this)).subscribe((otDevice) => {
      const { name: appName } = this.#supportAppsService.getAppVersionData(
        otDevice.appVersionId,
        this.#createNeoFlowStore.supportApps()
      );

      const tagsArray = this.getTagsArrayByMessageId(targetMessageId);
      if (tagsArray) {
        switch (appName) {
          case SUPPORT_APPS_OT_DEVICE.MODBUS_RTU: {
            const tags = this.getTagsFromRtuDevice(otDevice);
            tags.forEach((d) => {
              tagsArray.push(d);
            });
            break;
          }
          case SUPPORT_APPS_OT_DEVICE.MODBUS_TCP: {
            const tags = this.getTagsFromTcpDevice(otDevice);
            tags.forEach((d) => {
              tagsArray.push(d);
            });
            break;
          }
          case SUPPORT_APPS_OT_DEVICE.TEXOL213MM2R1: {
            const tags = this.getTagsFromTexol(otDevice);
            tags.forEach((d) => {
              tagsArray.push(d);
            });
            break;
          }
          default:
            break;
        }

        this.#cd.markForCheck();
      }
    });

    addOtDeviceTagDialogRef
      .afterClosed()
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        addOtDeviceTagDialogRef = undefined;
      });
  };

  addNewTag = (targetMessageId) => {
    const tagsArray = this.getTagsArrayByMessageId(targetMessageId);
    tagsArray.push(this.setMessageTagFg());
  };

  onRemoveMessageTag = (messageId, tagIndex) => {
    this.getTagsArrayByMessageId(messageId).removeAt(tagIndex);
  };

  changeDefaultValueValidation = (messageId, tagIndex) => {
    this.getTagsArrayByMessageId(messageId).at(tagIndex).get('dataClass').value === 'static'
      ? this.getTagsArrayByMessageId(messageId).at(tagIndex).get('defaultValue').setValidators([Validators.required])
      : this.getTagsArrayByMessageId(messageId).at(tagIndex).get('defaultValue').setValidators(null);

    this.getTagsArrayByMessageId(messageId).at(tagIndex).get('defaultValue').updateValueAndValidity();
    this.#cd.markForCheck();
  };

  onRemoveMessageSchema = (messageId) => {
    this.formArray.removeAt(messageId);
  };

  ngAfterViewInit() {
    this.onChange();
  }

  ngOnInit() {
    this.formArray = this.#fb.array([]);

    this.formArray.valueChanges.subscribe(() => {
      this.onChange();
    });
  }
}
