import { ITableQuery } from './table-query.model';

export interface INeoFlowState {
  neoflows: Neoflow[];
  page: number;
  size: number;
  queryKey: string;
  neoflowLength: number;
  isLoading: NEOFLOW_LOADING;
}

export interface INeoflowReq {
  total: number;
  neoflows: Neoflow[];
}

interface Neoflow {
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

export type TableQueryForNeoFlows = ITableQuery & { name?: string };

export enum NEOFLOW_LOADING {
  NONE,
  TABLE,
  CREATE,
  DELETE,
  DETAIL,
  COPY,
  REFRESH_TABLE
}
