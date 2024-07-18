import { ITableQuery } from './table-query.model';

export interface ILicenseState {
  isLoading: LICENSE_LOADING;
  companyLicense: ICompanyLicense[];
  companyOrders: ICompanyOrder[];
  page: number;
  size: number;
}

export interface IProjectLicense {
  name: string;
  companyQuantity: number;
  projectQuantity: number;
}

export interface ICompanyLicense {
  name: string;
  quantity: number;
  projects: ICompanyLicenseProject[];
}

export interface ICompanyLicenseProject {
  id: number;
  name: string;
  quantity: number;
  createdBy: string;
}

export interface IGetCompanyOrderReq extends ITableQuery {
  sort?: TLicenseSort;
}

export interface IGetCompanyOrdersResp {
  total: number;
  orders: ICompanyOrder[];
}

export interface ICompanyOrder {
  id: number;
  orderNumber: string;
  orderDate: string;
  customerContactName: string;
  customerContactEmail: string;
  ecvContactName: string;
  ecvContactEmail: string;
  items: ICompanyOrderItem[];
}

export interface ICompanyOrderItem {
  name: string;
  partNumber: string;
  quantity: number;
}

export type TLicenseSort = '' | 'date';

export enum LICENSE_LOADING {
  NONE,
  GET,
  REFRESH
}
