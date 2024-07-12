import { IBillingChartSeries, IMonthInfo, IUsageAndFee } from '@neo-edge-web/models';
import { datetimeFormat } from './datetimeFormat.helper';

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

export const getCurrentDateInfo = (currentDate: Date): IMonthInfo => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);

  // Format dates to YYYY-MM-DD
  const firstDayOfMonthStr = firstDayOfMonth.toISOString().split('T')[0];
  const lastDayOfMonthStr = lastDayOfMonth.toISOString().split('T')[0];

  // Last day of the month at 24:00:00 UTC+0, converting to local time
  const lastDayUTC = new Date(
    Date.UTC(lastDayOfMonth.getFullYear(), lastDayOfMonth.getMonth(), lastDayOfMonth.getDate(), 24)
  );
  // const lastDayUTCStr = lastDayUTC.toLocaleString(); // Local time representation
  const lastDayUTCStr = datetimeFormat(Math.round(lastDayUTC.getTime() / 1000)); // Local time representation

  // 12 months ago first day
  const twelveMonthsAgoFirstDay = new Date(year, month - 12, 1);
  const twelveMonthsAgoFirstDayStr = twelveMonthsAgoFirstDay.toISOString().split('T')[0];

  return {
    days: daysInMonth,
    firstDayOfMonth: firstDayOfMonthStr,
    lastDayOfMonth: lastDayOfMonthStr,
    lastDayUTC: lastDayUTCStr,
    twelveMonthsAgoFirstDay: twelveMonthsAgoFirstDayStr
  };
};
