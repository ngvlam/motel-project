import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'thousandsSeparator'
})
export class ThousandsSeparatorPipe implements PipeTransform {

  transform(value: number): string {
    if (isNaN(value)) {
      return '';
    }

    const digits = value.toString().split('');
    const formatted = [];

    while (digits.length > 3) {
      formatted.unshift(digits.splice(-3).join(''));
    }

    formatted.unshift(digits.join(''));
    return formatted.join('.');
  }

}
