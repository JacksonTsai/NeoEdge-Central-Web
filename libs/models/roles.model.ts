import { ITableQuery } from './table-query.model';

export interface RolesState {
  roleTable: IRole[];
  page: number;
  size: number;
  queryKey: string;
  isLoading: ROLES_LOADING;
  rolesLength: number;
}

export interface IGetRolesResp {
  total: number;
  roles: IRole[];
}

export interface IRole {
  id: number;
  name: string;
  createBy: string;
  createDate: number;
  users: string[];
}

export interface IEditRoleReq {
  description: string;
  name: string;
  permissions: number[];
}

export interface IGetRoleByIdResp {
  name: string;
  description: string;
  permissions: number[];
}

export type TableQueryForRoles = ITableQuery & { names?: string };

export enum ROLES_LOADING {
  NONE,
  TABLE,
  GET_ROLE_BY_ID,
  ADD_ROLE,
  EDIT_ROLE,
  DELETE_ROLE,
  REFRESH_TABLE
}

export enum RoleCategory {
  Custom = 0,
  'Built-in' = 1
}
