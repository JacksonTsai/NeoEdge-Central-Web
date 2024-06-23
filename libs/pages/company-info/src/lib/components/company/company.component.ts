import { CommonModule, NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostListener,
  OnInit,
  Output,
  effect,
  inject,
  input,
  signal
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  COMPANY_STATUS,
  COMP_INFO_LOADING,
  DATE_FORMAT,
  ICompanyProfile,
  ICompanyProfileResp,
  IEditCompanyProfileReq,
  LANG,
  PERMISSION,
  REGION,
  SUBSCRIPTION_PLAN
} from '@neo-edge-web/models';
import { datetimeFormat, img2Base64 } from '@neo-edge-web/utils';
import { NgxPermissionsModule } from 'ngx-permissions';

interface ICompForm {
  agreementBegin: number;
  agreementEnd: number;
  bizContactEmail: string;
  bizContactName: string;
  country: string;
  datetimeFormat: string;
  fqdn: string;
  language: string;
  logo: string;
  name: string;
  planId: number;
  shortName: string;
  status: string;
  techContactEmail: string;
  techContactName: string;
  website: string;
}

const defaultCompLogo = 'assets/images/default_company_white.png';

@Component({
  selector: 'ne-company',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatTooltipModule,
    NgClass,
    NgxPermissionsModule
  ],
  templateUrl: './company.component.html',
  styleUrl: './company.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CompanyComponent implements OnInit {
  @Output() handleEditCompInfo = new EventEmitter<IEditCompanyProfileReq>();
  #fb = inject(FormBuilder);
  compInfo = input<ICompanyProfileResp>();
  isLoading = input<COMP_INFO_LOADING>();
  permission = PERMISSION;
  isEditMode = signal(false);

  companyLogo = signal('');

  form: UntypedFormGroup;
  langOpts = LANG;
  regionOpts = REGION;
  dateFormatOpts = DATE_FORMAT;
  subscriptionPlan = SUBSCRIPTION_PLAN;
  companyStatus = COMPANY_STATUS;

  @HostListener('change', ['$event.target.files']) emitFiles(event: FileList) {
    if (!event) return;
    const file = event && event.item(0);
    const companyImg = file;
    img2Base64(companyImg).subscribe((d) => {
      this.companyLogo.set(`data:${file.type};base64,${d}`);
      this.iconPathCtrl.setValue(companyImg);
      this.form.markAsDirty();
    });
  }

  get bizContactEmailCtrl() {
    return this.form.get('bizContactEmail') as UntypedFormControl;
  }

  get bizContactNameCtrl() {
    return this.form.get('bizContactName') as UntypedFormControl;
  }

  get techContactEmailCtrl() {
    return this.form.get('techContactEmail') as UntypedFormControl;
  }

  get techContactNameCtrl() {
    return this.form.get('techContactName') as UntypedFormControl;
  }

  get countryCtrl() {
    return this.form.get('country') as UntypedFormControl;
  }

  get datetimeFormatCtrl() {
    return this.form.get('datetimeFormat') as UntypedFormControl;
  }

  get languageCtrl() {
    return this.form.get('language') as UntypedFormControl;
  }

  get iconPathCtrl() {
    return this.form.get('iconPath') as UntypedFormControl;
  }

  get companyProfile() {
    return (this.form?.getRawValue() as ICompForm) ?? null;
  }

  constructor() {
    effect(
      () => {
        if (this.compInfo() && this.isLoading() !== COMP_INFO_LOADING.EDIT_PROFILE) {
          this.setFormValue(this.compInfo());
        }

        if (this.isLoading() === COMP_INFO_LOADING.NONE) {
          this.changeEditMode(false);
        }
      },
      { allowSignalWrites: true }
    );
  }

  setFormValue = (compInfo: ICompanyProfileResp) => {
    this.form.setValue({
      agreementBegin: compInfo?.agreementBegin ?? '',
      agreementEnd: compInfo?.agreementEnd ?? '',
      bizContactEmail: compInfo?.bizContact.email ?? '',
      bizContactName: compInfo?.bizContact.name ?? '',
      country: compInfo?.country ?? '',
      datetimeFormat: compInfo?.datetimeFormat ?? '',
      fqdn: compInfo?.fqdn ?? '',
      language: compInfo?.language ?? '',
      iconPath: compInfo?.iconPath !== '' ? compInfo.iconPath : defaultCompLogo,
      name: compInfo?.name ?? '',
      planId: compInfo?.planId ?? '',
      shortName: compInfo?.shortName ?? '',
      status: compInfo?.status ?? '',
      techContactEmail: compInfo?.techContact?.email ?? '',
      techContactName: compInfo?.techContact?.name ?? '',
      website: compInfo?.website ?? ''
    });
    if (compInfo?.iconPath !== '') {
      this.companyLogo.set(`${this.iconPathCtrl.value}?timestamp=${Date.now()}`);
    } else {
      this.companyLogo.set(`defaultCompLogo?timestamp=${Date.now()}`);
    }
  };

  getDatetimeFormat = (timestamp: number) => {
    return datetimeFormat(timestamp);
  };

  changeEditMode = (isEdit: boolean) => {
    this.isEditMode.set(isEdit);
    if (isEdit) {
      this.bizContactEmailCtrl.enable();
      this.bizContactNameCtrl.enable();
      this.techContactEmailCtrl.enable();
      this.techContactNameCtrl.enable();
      this.countryCtrl.enable();
      this.datetimeFormatCtrl.enable();
      this.languageCtrl.enable();
      this.iconPathCtrl.enable();
    } else {
      this.bizContactEmailCtrl.disable();
      this.bizContactNameCtrl.disable();
      this.techContactEmailCtrl.disable();
      this.techContactNameCtrl.disable();
      this.countryCtrl.disable();
      this.datetimeFormatCtrl.disable();
      this.languageCtrl.disable();
      this.iconPathCtrl.disable();
    }
  };

  onCancelEdit = () => {
    this.changeEditMode(false);
    this.setFormValue(this.compInfo());
    this.companyLogo.set(this.compInfo()?.iconPath !== '' ? this.compInfo().iconPath : defaultCompLogo);
    this.form.markAsPristine();
  };

  onEdit = () => {
    this.changeEditMode(true);
  };

  onSave = () => {
    const companyProfile: ICompanyProfile = {
      bizContact: {
        email: (this.bizContactEmailCtrl.value as string).trim(),
        name: (this.bizContactNameCtrl.value as string).trim()
      },
      country: this.countryCtrl.value,
      datetimeFormat: this.datetimeFormatCtrl.value,
      language: this.languageCtrl.value,
      techContact: {
        email: (this.techContactEmailCtrl.value as string).trim(),
        name: (this.techContactNameCtrl.value as string).trim()
      }
    };

    const companyProfileReq: IEditCompanyProfileReq = {
      profile: companyProfile
    };

    if (typeof this.iconPathCtrl.value !== 'string') {
      Object.assign(companyProfileReq, { companyIcon: this.iconPathCtrl.value });
    }

    this.handleEditCompInfo.emit(companyProfileReq);
  };

  ngOnInit(): void {
    this.form = this.#fb.group({
      agreementBegin: [{ value: this.compInfo()?.agreementBegin ?? '' }],
      agreementEnd: [{ value: this.compInfo()?.agreementEnd ?? '' }],
      bizContactEmail: [
        { value: this.compInfo()?.bizContact.email ?? '', disabled: true },
        [Validators.required, Validators.email]
      ],
      bizContactName: [
        { value: this.compInfo()?.bizContact.name ?? '', disabled: true },
        [Validators.required, Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]
      ],
      country: [{ value: this.compInfo()?.country ?? '', disabled: true }, [Validators.required]],
      datetimeFormat: [{ value: this.compInfo()?.datetimeFormat ?? '', disabled: true }, [Validators.required]],
      fqdn: [{ value: this.compInfo()?.fqdn ?? '' }, [Validators.required]],
      language: [{ value: this.compInfo()?.language ?? '', disabled: true }, [Validators.required]],
      iconPath: [{ value: this.compInfo()?.iconPath !== '' ? this.compInfo()?.iconPath : defaultCompLogo }],
      name: [{ value: this.compInfo()?.name ?? '' }, [Validators.required]],
      planId: [{ value: this.compInfo()?.planId ?? '' }],
      shortName: [{ value: this.compInfo()?.shortName ?? '' }],
      status: [{ value: this.compInfo()?.status ?? '' }],
      techContactEmail: [
        { value: this.compInfo()?.techContact.email ?? '', disabled: true },
        [Validators.required, Validators.email]
      ],
      techContactName: [
        { value: this.compInfo()?.techContact.name ?? '', disabled: true },
        [Validators.required, Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]
      ],
      website: [{ value: this.compInfo()?.website ?? '' }]
    });
  }
}
