import { DATE_FORMAT } from '@neo-edge-web/models';
import dayjs from 'dayjs';

export const datetimeFormat = (timestamp: number, format?: DATE_FORMAT) => {
  return isNaN(timestamp) ? '-' : dayjs(timestamp).format(format ?? DATE_FORMAT['YYYY-MM-DD HH:mm:ss']);
};
