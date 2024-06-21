import {
  ApexAxisChartSeries,
  ApexChart,
  ApexLegend,
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexTitleSubtitle,
  ApexXAxis
} from 'ng-apexcharts';

export type TBarChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  title: ApexTitleSubtitle;
};

export type TPieChartOptions = {
  title?: ApexTitleSubtitle;
  colors?: any[];
  chart: ApexChart;
  series: ApexNonAxisChartSeries;
  labels: any;
  legend?: ApexLegend;
  responsive?: ApexResponsive[];
};

export interface IPieChartSetting {
  series: number[];
  labels: string[];
}
