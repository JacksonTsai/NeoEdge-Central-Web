export interface IBiilingState {
  isLoading: BILLING_LOADING;
  timeRecord: IBillingTimeRecord;
  monthUsageFee: IGetBillingResp;
  pastUsageFee: IGetBillingResp;
  estimate: IBillingEstimateResp;
  billingRecords: IGetBillingRecordResp;
}

export interface IBillingTimeRecord {
  days: number;
  today: string;
  monthStart: string;
  monthEnd: string;
  monthEndUTC: number;
  pastMonths: number;
  pastStart: string;
}

export interface IBillingMonthInfo {
  days: number;
  today: string;
  firstDayOfMonth: string;
  lastDayOfMonth: string;
  lastDayUTC: number;
  twelveMonthsAgoFirstDay: string;
}
export interface IBillingReq {
  type: TGetBillingType;
  params: IBillingParamsReq;
}

export interface IBillingParamsReq {
  dateGe: string;
  dateLe: string;
  groupBy: TBillingGroupBy;
}

export interface IGetBillingResp {
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

export interface IBillingChartSeriesTitle {
  usage: string;
  fee: string;
}

export interface IBillingEstimateResp {
  billBegin: string;
  billEnd: string;
  baseFee: number;
  dailyRate: number;
  extraFee: number;
  currency: string;
  totalUsage: number;
  totalFee: number;
  estimateUsage: number;
  estimateFee: number;
  caculateAt: number;
}

export interface IBillingChart {
  series: IBillingChartSeries;
  labels: string[];
  currency?: string;
  height?: number;
}

export interface ICurrencyData {
  currency: string;
  unit: string;
}

export interface IGetBillingRecordResp {
  total: number;
  billingRecords: IBillingRecord[];
}

export interface IBillingRecord {
  billingMonth: string;
  billNo: string;
  amount: number;
  currency: string;
}

export interface IDownloadBillingRecordReq {
  billingMonth: string;
}

export type TBillingGroupBy = 'year' | 'month' | 'day';

export type TGetBillingType = 'fullMonth' | 'fullYear';

export type TBillingTotalType = 'current' | 'estimate';

export enum BILLING_LOADING {
  NONE,
  GET,
  REFRESH,
  DOWNLOAD
}

export enum BILLING_TOTAL_TYPE {
  CURRENT,
  ESTIMATE
}
