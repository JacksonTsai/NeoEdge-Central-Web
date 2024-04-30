import { SUBSCRIPTION_PLAN } from './utils.model';

export interface SubscriptionPlanState {
  currentPlan: IGetSubscriptionResp;
  isLoading: SUBSCRIPTION_LOADING;
}

export interface IGetSubscriptionResp {
  agreementBegin: number;
  agreementEnd: number;
  agreementNo: string;
  baseFee: number;
  billingCycle: number;
  channel: string;
  currency: string;
  extraFee: number;
  hourlyRate: number;
  planId: number;
  sales: string;
  status: number;
  techSupport: string;
}

export interface IUpgradePlanReq {
  message: string;
  requester: string;
  planId: SUBSCRIPTION_PLAN;
}

export enum SUBSCRIPTION_LOADING {
  NONE,
  REFRESH,
  GET_CURRENT_PLAN,
  SEND_UPGRADE,
  SEND_SUCCESS
}
