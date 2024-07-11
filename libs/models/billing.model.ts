export type TBillingGroupBy = 'year' | 'month' | 'day';

export interface IProjectFeeReq {
  dateGe: Date;
  dateLe: Date;
  groupBy: TBillingGroupBy;
}

export interface IProjectFeeResp {
  dailyRate: number;
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

export interface IBillingChart {
  series: IBillingChartSeries;
  labels: string[];
}
