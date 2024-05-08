export const obj2FormData = (obj: object): FormData => {
  const fd = new FormData();
  for (const i of Object.keys(obj)) {
    fd.append(i, obj[i]);
  }
  return fd;
};
