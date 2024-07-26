import { formatCurrency } from '@angular/common';
import { inject, LOCALE_ID, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currencyCustom',
  standalone: true
})
export class currencyCustomPipe implements PipeTransform {
  private local = inject(LOCALE_ID);

  transform(value: number, currencyCode: string, showCurrencySymbol: boolean = true): string | null {
    // Setting the currency code for not displaying decimal points
    const noDecimalCurrencies = ['NTD', 'TWD', 'JPY', 'KRW', 'VND', 'IDR'];

    // Set the decimal format according to the currency code.
    const digitInfo = noDecimalCurrencies.includes(currencyCode.toUpperCase()) ? '1.0-0' : '1.2-2';

    // Determine whether to display the currency symbol
    const display = showCurrencySymbol ? currencyCode : '';

    // Convert with CurrencyPipe
    return formatCurrency(value, this.local, display, currencyCode, digitInfo);
  }
}
