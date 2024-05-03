import { IRole } from './roles.model';
import { ITableQuery } from './table-query.model';

export interface UsersState {
  userTable: User[];
  page: number;
  size: number;
  isLoading: USERS_LOADING;
  usersLength: number;
  roleList: IRole[];
  queryKey: string;
}

export interface IUsersResp {
  users: User[];
  total: number;
}

export interface User {
  account: string;
  accountStatus: number;
  id: number;
  name: string;
  projects: string[];
  roleName: string;
  isMfaEnable: 0 | 1;
}

export interface IInviteUserReq {
  account: string;
  roleId: number;
}

export interface IEditUserStatusReq {
  isMfaEnable: 0 | 1;
  roleId: number;
  status: number;
}

export type TableQueryForUsers = ITableQuery & { accounts?: string };
export type TableQueryForUserProjects = ITableQuery & { name?: string };

export enum USER_STATUE {
  Waiting = 0,
  Active = 1,
  Inactive = 2
}

export enum USERS_LOADING {
  NONE,
  TABLE,
  GET_USER_PERMISSION,
  USER_PERMISSION_SUMMIT,
  DELETE_USER,
  ROLE_LIST,
  INVITE_USER,
  Edit_USER,
  REFRESH_TABLE
}
