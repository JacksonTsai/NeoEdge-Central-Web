import { ITableQuery } from './table-query.model';

export interface INeoFlowState {
  neoflows: any[];
  page: number;
  size: number;
  queryKey: string;
  neoflowLength: number;
  isLoading: NEOFLOW_LOADING;
}

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
