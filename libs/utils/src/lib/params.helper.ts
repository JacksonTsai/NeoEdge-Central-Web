import { DATE_FORMAT } from '@neo-edge-web/models';
import { datetimeFormat } from './datetimeFormat.helper';

interface IParmas {
  [key: string]: any;
}

export const setParamsArrayWithKey = (params: IParmas): URLSearchParams => {
  const paramsResult = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === null || value === '') {
      return;
    }

    if (['dateGe', 'dateLe'].includes(key)) {
      const date = datetimeFormat(
        Math.round(value.getTime() / 1000),
        DATE_FORMAT['YYYY-MM-DD HH:mm:ss'],
        false
      ).replace(/\//, '-');
      paramsResult.set(key, date);
    } else if (typeof value === 'number') {
      paramsResult.set(key, value.toString());
    } else if (Array.isArray(value)) {
      value.forEach((item) => {
        paramsResult.append(key, item.toString());
      });
    } else {
      paramsResult.set(key, value);
    }
  });

  return paramsResult;
};
