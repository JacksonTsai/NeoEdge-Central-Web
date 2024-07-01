import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatCount',
  standalone: true
})
export class FormatCountPipe implements PipeTransform {
  transform(value: number): string {
    return value ? `(${value})` : '';
  }
}
