import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'phoneHide'
})
export class PhoneHidePipe implements PipeTransform {

  transform(value: string, start: number = 0, end: number = 0): string {
    if (!value) {
      return '';
    }

    const visibleDigits = value.substring(start, value.length - end);
    const hiddenDigits = value.length - visibleDigits.length;
    const maskedDigits = '*'.repeat(hiddenDigits);

    return `${maskedDigits}${visibleDigits}`;
  }

}
