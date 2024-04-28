import { ReplaySubject } from 'rxjs';

export const img2Base64 = (imgFile: File) => {
  const result = new ReplaySubject<string>(1);
  const reader = new FileReader();
  reader.readAsBinaryString(imgFile);
  reader.onload = (event) => result.next(btoa(event.target.result.toString()));
  return result;
};
