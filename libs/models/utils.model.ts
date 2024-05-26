export enum SUBSCRIPTION_PLAN {
  trial = 1,
  standard = 2,
  premium = 3
}

export enum COMPANY_STATUS {
  Active = 0,
  Suspend = 1,
  Terminate = 2
}

export interface IGatewayLabels {
  colorCode: string;
  name: string;
  id?: number;
}

export enum BOOLEAN_STATUS {
  FALSE = 0,
  TRUE = 1
}
