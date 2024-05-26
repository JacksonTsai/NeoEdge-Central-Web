export interface ICustomOSResp {
  oss: ICustomOss[];
}

export interface IPartnersIpcResp {
  partners: IPartnerIpc[];
}

export interface ICustomOss {
  id: number;
  name: string;
}

export interface IPartnerIpc {
  id: number;
  name: string;
  partnerIconPath: string;
  partnerModelSeries: IPartnerModelSeries[];
}

export interface IPartnerModelSeries {
  id: number;
  name: string;
  oss: IPartnersOs[];
  models: IPartnerModel[] | null;
}

export interface IPartnerModel {
  id: number;
  name: string;
  modelIconPath: string;
  serialPorts: SerialPort[];
}

interface SerialPort {
  name: string;
  path: string;
}

export interface IPartnersOs {
  id: number;
  name: string;
}
