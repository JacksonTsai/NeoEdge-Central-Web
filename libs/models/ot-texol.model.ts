export enum TEXOL_TAG_TYPE {
  General = 'General',
  Dedicated = 'Dedicated'
}

export interface ITexolTag {
  TagName: string;
  DataType: string;
}
