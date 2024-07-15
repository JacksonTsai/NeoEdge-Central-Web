import {
  IBillingChart,
  IBillingChartSeries,
  IBillingChartSeriesTitle,
  IBillingMonthInfo,
  IUsageAndFee
} from '@neo-edge-web/models';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { ApexOptions } from 'ng-apexcharts';
import { getChartColor } from './chart-color.helper';

// Extend dayjs with the plugins
dayjs.extend(utc);
dayjs.extend(timezone);

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

export const getCurrentDateInfo = (currentDate: Date): IBillingMonthInfo => {
  const today = dayjs(currentDate);
  const daysInMonth = today.daysInMonth();
  const formatDate = 'YYYY-MM-DD';

  // Current month first day and last day
  const firstDayOfMonth = today.startOf('month').hour(0).minute(0).second(0).millisecond(0);
  const lastDayOfMonth = today.endOf('month').hour(23).minute(59).second(59).millisecond(999);

  // Last day of the month at 24:00:00 UTC+0, converting to local time
  const endOfMonthUTC = dayjs.utc().add(1, 'month').startOf('month').hour(0).minute(0).second(0).millisecond(0);
  const endOfMonthLocal = endOfMonthUTC.local();

  // 12 months ago first day
  const twelveMonthsAgo = today.subtract(12, 'months');
  // const twelveMonthsAgoFirstDay = twelveMonthsAgo.startOf('month');

  return {
    days: daysInMonth,
    today: today.format(formatDate),
    firstDayOfMonth: firstDayOfMonth.format(formatDate),
    lastDayOfMonth: lastDayOfMonth.format(formatDate),
    lastDayUTC: endOfMonthLocal.unix(),
    twelveMonthsAgoFirstDay: twelveMonthsAgo.format(formatDate)
  };
};

export const getChartOption = (setting: IBillingChart): ApexOptions => {
  const title: IBillingChartSeriesTitle = {
    usage: 'Usage',
    fee: 'Fee'
  };

  const chartColor: string[] = getChartColor(2);

  return {
    colors: chartColor,
    series: [
      {
        name: title.usage,
        type: 'column',
        data: setting.series.usage
      },
      {
        name: `${title.fee} (${setting.currency})`,
        type: 'line',
        data: setting.series.fee
      }
    ],
    chart: {
      height: setting.height ?? 240,
      type: 'line',
      toolbar: {
        show: false
      }
    },
    stroke: {
      width: [0, 1]
    },
    dataLabels: {
      enabled: true,
      enabledOnSeries: [1]
    },
    labels: setting.labels,
    legend: {
      position: 'top'
    },
    yaxis: [
      {
        title: {
          text: title.usage
        }
      },
      {
        opposite: true,
        title: {
          text: `${title.fee} (${setting.currency})`
        }
      }
    ]
  };
};
