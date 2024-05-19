import { ITableQuery } from './table-query.model';
import { User } from './users.model';

export interface IProjectsState {
  projects: IProjectsForUI[];
  page: number;
  size: number;
  projectsLength: number;
  queryKey: string;
  users: User[];
  isLoading: PROJECTS_LOADING;
  isSwitchProject: boolean;
  currentProject: number;
}

export interface IProjectsForUI extends Omit<IProjectByIdResp, 'users'> {
  users: User[];
}

export interface IGetProjectsResp {
  total: number;
  projects: IProjectByIdResp[];
}

export interface IProjectByIdResp {
  id: number;
  name: string;
  shortName: string;
  description: string;
  customer: string;
  users: number[];
  createdBy: string;
  createdAt: number;
  updatedAt: number;
  projectFields: IProjectField[];
}

export interface IProjectField {
  id?: number;
  name: string;
  value: string;
}

export interface IEditProjectReq {
  customer: string;
  description: string;
  name: string;
  projectFields: IProjectField[];
  shortName: string;
  users: number[];
}

export interface IDeleteProjectReq {
  name: string;
}

export type TableQueryForProjects = ITableQuery & { name?: string };

export enum PROJECTS_LOADING {
  NONE,
  TABLE,
  GET_USERS,
  CREATE,
  EDIT,
  DELETE,
  REFRESH_TABLE
}
