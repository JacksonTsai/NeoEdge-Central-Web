export const chartColors = [
  '#FF9F5A',
  '#0FADB7',
  '#3077CB',
  '#F4839A',
  '#FDD16A',
  '#3BCBEB',
  '#F87A7A',
  '#84DE81',
  '#96B0C6',
  '#B67EFC'
];

export const getChartColor = (num: number): string[] => {
  return chartColors.slice(0, num);
};
