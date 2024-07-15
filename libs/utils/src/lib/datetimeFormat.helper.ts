import { DATE_FORMAT } from '@neo-edge-web/models';
import dayjs from 'dayjs';

export const datetimeFormat = (timestamp: number, format?: DATE_FORMAT, showTime = true) => {
  let useFormat = format ?? (DATE_FORMAT['YYYY-MM-DD HH:mm:ss'] as string);
  if (!isNaN(timestamp) && !showTime) {
    useFormat = useFormat.slice(0, 10);
  }
  return isNaN(timestamp) ? '-' : dayjs(timestamp * 1000).format(useFormat);
};

export const dateFormat = (timestamp: number | Date): string => {
  const currentTimestamp = typeof timestamp === 'number' ? timestamp : timestamp.getTime() / 1000;
  return datetimeFormat(currentTimestamp, DATE_FORMAT['YYYY-MM-DD HH:mm:ss'], false);
};

export const dateDashToSlash = (date: string): string => date?.replace(/-/g, '/') || '';

export const getPastDay = (days: number, now?: Date): Date => {
  const nowCurrent = now || new Date();
  return dayjs(nowCurrent).subtract(days, 'day').toDate();
};

export const getPastMonths = (months: number, now?: Date): Date => {
  const today = now || new Date();
  return dayjs(today).subtract(months, 'month').toDate();
};

export const getTimeZone = (): string => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
};

/**
 * Generates an array of the past `years` years, including the current year.
 *
 * @param {Date} endDate - The end date from which to calculate the past years.
 * @param {number} years - The number of past years to include.
 * @returns {string[]} An array of strings representing the past years.
 *                     Ex: Input: 2024/07/11 (Date format),
 *                     Output: ["2020", "2021", "2022", "2023", "2024"]
 */
export const generatePastYears = (endDate: Date, years: number): string[] => {
  const yearsArray: string[] = [];
  const endYear = endDate.getFullYear();
  for (let i = years; i > 0; i--) {
    yearsArray.push((endYear - i).toString());
  }
  yearsArray.push(endYear.toString());
  return yearsArray;
};

/**
 * Generates an array of the past `months` months, including the current month.
 *
 * @param {Date} endDate - The end date from which to calculate the past months.
 * @param {number} months - The number of past months to include.
 * @returns {string[]} An array of strings representing the past months in 'YYYY-MM' format.
 *                     Ex: Input: 2024/07/11 (Date format),
 *                     Output: ["2024-02", "2024-03", "2024-04", "2024-05", "2024-06", "2024-07"]
 */
export const generatePastMonths = (endDate: Date, months: number): string[] => {
  const monthsArray: string[] = [];
  for (let i = 0; i < months; i++) {
    const tempDate = new Date(endDate);
    tempDate.setMonth(tempDate.getMonth() - i);
    const month = tempDate.getMonth() + 1;
    const year = tempDate.getFullYear();
    monthsArray.push(`${year}-${month.toString().padStart(2, '0')}`);
  }
  return monthsArray.reverse();
};

/**
 * Generates an array of all the days in the month of the given `endDate`.
 *
 * @param {Date} now - The date from which to calculate the month days.
 * @returns {string[]} An array of strings representing all days in the month in 'YYYY-MM-DD' format.
 *                     Ex: Input: 2024/07/11 (Date format),
 *                     Output: ["2024-07-01", "2024-07-02", ..., "2024-07-31"]
 */
export const generateMonthDays = (now: Date): string[] => {
  const daysArray: string[] = [];
  const today = dayjs(now);
  const firstDay = today.startOf('month');
  const daysInMonth = today.daysInMonth();
  for (let i = 0; i < daysInMonth; i++) {
    daysArray.push(firstDay.add(i, 'day').format('YYYY-MM-DD'));
  }
  return daysArray;
};
