import { ITableQuery } from './table-query.model';

export interface INeoFlowState {
  neoflows: INeoflow[];
  page: number;
  size: number;
  queryKey: string;
  neoflowLength: number;
  isLoading: NEOFLOW_LOADING;
}

export interface INeoflowResp {
  total: number;
  neoflows: INeoflow[];
}

export interface INeoflow {
  id: number;
  name: string;
  tagNumber: number;
  version: number;
  processes: any;
  otDevices: any;
  itServices: any;
  createdAt: number;
  updatedAt: number;
  createdBy: any;
  gateways: any;
}

export interface ISetting {}

export type TTableQueryForNeoFlows = ITableQuery & { name?: string };

export enum NEOFLOW_LOADING {
  NONE,
  TABLE,
  CREATE,
  DELETE,
  DETAIL,
  COPY,
  REFRESH_TABLE
}
