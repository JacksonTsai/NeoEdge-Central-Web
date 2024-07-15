export interface IPieChartSetting {
  series: number[];
  labels: string[];
}

export enum CHART_COLORS {
  PrimaryBlue = '#1d50a2',
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
  Connected = '#5CCB59',
  Disconnected = '#F87A7A',
  Passive = '#1E282C',
  Detach = '#C4D7E9'
}
