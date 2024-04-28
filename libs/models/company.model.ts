export interface ICompanyProfileState {
  companyInfo: ICompanyProfileResp | null;
  isLoading: COMP_INFO_LOADING;
}

export interface ICompanyProfileResp {
  agreementBegin: number;
  agreementEnd: number;
  bizContact: BizContact;
  country: string;
  datetimeFormat: string;
  fqdn: string;
  language: string;
  logo: string;
  name: string;
  planId: number;
  shortName: string;
  status: COMP_STATUS;
  techContact: BizContact;
  website: string;
}

export interface BizContact {
  email: string;
  name: string;
}

export interface IEditCompanyProfileReq {
  bizContact: BizContact;
  country: string;
  datetimeFormat: string;
  language: string;
  techContact: BizContact;
  logo: string;
}

export enum COMP_INFO_LOADING {
  NONE,
  EDIT_PROFILE,
  GET_PROFILE,
  REFRESH
}

export enum COMP_STATUS {
  'Active' = 1,
  'Suspend' = 2,
  'Terminate' = 3
}
