import { ILiveMonitorChart } from '@neo-edge-web/models';
import { ApexOptions } from 'ng-apexcharts';
import { getChartColor } from './chart-color.helper';

export const getLiveMonitorChartOption = (setting: ILiveMonitorChart): ApexOptions => {
  const colors: string[] = getChartColor(2);
  return {
    colors: setting.type === 'CPU' ? [colors[0]] : [colors[1]],
    series: [
      {
        name: 'Usage',
        data: setting.series
      }
    ],
    chart: {
      height: 200,
      type: 'area',
      toolbar: {
        show: false
      },
      zoom: {
        enabled: false
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      width: [1],
      curve: 'straight'
    },
    xaxis: {
      labels: {
        show: false
      },
      categories: ['', '', '', '', '', '', '', '', ''],
      tooltip: {
        enabled: false
      }
    },
    yaxis: {
      forceNiceScale: false,
      max: 100,
      labels: {
        formatter: (value) => value.toFixed(0) + '%'
      }
    }
  };
};
