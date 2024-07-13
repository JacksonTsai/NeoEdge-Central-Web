interface IParmas {
  [key: string]: any;
}

export const setParamsArrayWithKey = (params: IParmas): URLSearchParams => {
  const paramsResult = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === null || value === '') {
      return;
    }

    if (typeof value === 'number') {
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
