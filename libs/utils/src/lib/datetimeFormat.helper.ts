import { DATE_FORMAT } from '@neo-edge-web/models';
import dayjs from 'dayjs';

export const datetimeFormat = (timestamp: number, format?: DATE_FORMAT, showTime = true) => {
  let useFormat = format ?? (DATE_FORMAT['YYYY-MM-DD HH:mm:ss'] as string);
  if (!showTime) {
    useFormat = useFormat.slice(0, 10);
  }
  return isNaN(timestamp) ? '-' : dayjs(timestamp * 1000).format(useFormat);
};
