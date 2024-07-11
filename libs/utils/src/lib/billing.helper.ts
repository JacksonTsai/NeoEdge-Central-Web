import { IBillingChartSeries, IUsageAndFee } from '@neo-edge-web/models';

export const getChartUsageAndFee = (list: string[], usageAndFee: IUsageAndFee[]): IBillingChartSeries => {
  const result: IBillingChartSeries = {
    usage: new Array(list.length).fill(0),
    fee: new Array(list.length).fill(0)
  };
  usageAndFee.forEach((item) => {
    const index = list.indexOf(item.billingDate);
    if (index !== -1) {
      result.usage[index] = item.usage;
      result.fee[index] = item.fee;
    }
  });
  return result;
};
