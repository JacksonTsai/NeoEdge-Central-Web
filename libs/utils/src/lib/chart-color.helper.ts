import { CHART_COLORS, STATUS_COLORS } from '@neo-edge-web/models';

type TColor = 'normal' | 'status';

export const chartColors = [
  CHART_COLORS.Teal,
  CHART_COLORS.LightOrange,
  CHART_COLORS.MediumBlue,
  CHART_COLORS.LightPink,
  CHART_COLORS.LightYellow,
  CHART_COLORS.SkyBlue,
  CHART_COLORS.LightRed,
  CHART_COLORS.LightGreen,
  CHART_COLORS.LightBlueGray,
  CHART_COLORS.LightPurple
];

export const statusColor = [
  STATUS_COLORS.Waiting,
  STATUS_COLORS.Connected,
  STATUS_COLORS.Disconnected,
  STATUS_COLORS.Detach
];

export const getChartColor = (num: number, type?: TColor): string[] => {
  return type === 'status' ? statusColor.slice(0, num) : chartColors.slice(0, num);
};
