import { Pipe, PipeTransform } from '@angular/core';
import { datetimeFormat } from '../utils/src';

@Pipe({
  name: 'dateTimeFormat',
  standalone: true
})
export class dateTimeFormatPipe implements PipeTransform {
  transform(value: number): string {
    return datetimeFormat(value);
  }
}
