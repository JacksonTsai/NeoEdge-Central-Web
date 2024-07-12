export interface IBiilingState {
  isLoading: BILLING_LOADING;
  timeRecord: IBillingTimeRecord;
  dayUsageFee: IBillingResp;
  pastUsageFee: IBillingResp;
  estimate: IBillingEstimateResp;
}

export interface IBillingTimeRecord {
  days: number;
  monthStart: string;
  monthEnd: string;
  monthEndUTC: string;
  pastMonths: number;
  pastStart: string;
}

export interface IBillingReq {
  type: TGetBillingType;
  params: IBillingParamsReq;
}

export interface IBillingParamsReq {
  dateGe: Date;
  dateLe: Date;
  groupBy: TBillingGroupBy;
}

export interface IBillingResp {
  dailyRate?: number;
  currency: string;
  usageAndFee: IUsageAndFee[];
  caculateAt: number;
}

export interface IUsageAndFee {
  billingDate: string;
  usage: number;
  fee: number;
}

export interface IBillingChartSeries {
  usage: number[];
  fee: number[];
}

export interface IBillingEstimateResp {
  baseFee: number;
  dailyRate: number;
  extraFee: number;
  totalUsage: number;
  totalFee: number;
  estimateUsage: number;
  estimateFee: number;
  currency: string;
  caculateAt: number;
}

export interface IBillingChart {
  series: IBillingChartSeries;
  labels: string[];
}

export interface ICurrencyData {
  currency: string;
  unit: string;
}

export interface IMonthInfo {
  days: number;
  firstDayOfMonth: string;
  lastDayOfMonth: string;
  lastDayUTC: string;
  twelveMonthsAgoFirstDay: string;
}

export type TBillingGroupBy = 'year' | 'month' | 'day';

export type TGetBillingType = 'day' | 'month';

export type TBillingTotalType = 'current' | 'estimate';

export enum BILLING_LOADING {
  NONE,
  GET,
  REFRESH
}

export enum BILLING_TOTAL_TYPE {
  CURRENT,
  ESTIMATE
}
