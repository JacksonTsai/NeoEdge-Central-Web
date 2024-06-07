export interface IGetItServiceDetailResp {
  appVersionId: number;
  name: string;
  setting: any;
}

export interface IEditItServiceDetailReq {
  name: string;
  setting: any;
}

export interface IDeleteItServiceDetailReq {
  profileId: number;
  name: string;
}

export enum IT_SERVICE_DETAIL_LOADING {
  NONE,
  TABLE,
  REFRESH,
  DELETE
}
