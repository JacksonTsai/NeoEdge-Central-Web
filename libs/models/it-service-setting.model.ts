export interface IItServiceSettingCaCert {
  Name: string;
  Content: string;
}

export interface IItServiceSettingCredentials {
  CaCert?: IItServiceSettingCaCert;
  SkipCertVerify?: boolean;
}
