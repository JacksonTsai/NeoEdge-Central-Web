
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

export interface IItServiceConnectionOption {
  key: string;
  value: number;
  label: string;
  default?: boolean;
}

export interface IItServiceQoSOption {
  value: number;
  selected?: boolean;
}

export enum IT_SERVICE_DETAIL_LOADING {
  NONE,
  TABLE,
  REFRESH,
  DELETE
}

export enum IT_SERVICE_DETAIL_MODE {
  CREATE,
  EDIT,
  VEIW
}
