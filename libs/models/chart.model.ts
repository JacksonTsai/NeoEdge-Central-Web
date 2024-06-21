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

export enum CHART_COLORS {
  LightOrange = '#FF9F5A',
  Teal = '#0FADB7',
  MediumBlue = '#3077CB',
  LightPink = '#F4839A',
  LightYellow = '#FDD16A',
  SkyBlue = '#3BCBEB',
  LightRed = '#F87A7A',
  LightGreen = '#84DE81',
  LightBlueGray = '#96B0C6',
  LightPurple = '#B67EFC'
}

export enum STATUS_COLORS {
  Waiting = '#fdd16a',
  Disconnected = '#96b0c6',
  Connected = '#3077cb',
  Passive = '#1E282C',
  Detach = '#A9B6C3'
}
