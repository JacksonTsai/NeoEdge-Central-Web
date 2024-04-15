export interface UsersState {
  userTable: User[];
  page: number;
  size: number;
}

export interface IGetUsersQueryStrReq {
  page: number;
  size: number;
}

export interface IUsersResp {
  list: User[];
  total: number;
}

export interface User {
  account: string;
  accountStatus: number;
  id: number;
  name: string;
  projects: string[];
  roleName: string;
}
