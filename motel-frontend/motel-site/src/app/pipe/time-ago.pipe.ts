import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
    name: 'timeAgo'
  })
  export class TimeAgoPipe implements PipeTransform {

    transform(value: string): string {
        const now = new Date();
        const time = new Date(value)
        const diff = now.getTime() - time.getTime();
      
        const minute = 60 * 1000;
        const hour = 60 * minute;
        const day = 24 * hour;
        const month = 30 * day;
      
        if (diff < minute) {
          return 'Ngay bây giờ';
        } else if (diff < hour) {
          const minutes = Math.floor(diff / minute);
          return `${minutes} phút trước`;
        } else if (diff < day) {
          const hours = Math.floor(diff / hour);
          return `${hours} giờ trước`;
        } else if (diff < month) {
          const days = Math.floor(diff / day);
          return `${days} ngày trước`;
        } else {
          const months = Math.floor(diff / month);
          return `${months} tháng trước`;
        }
      }
      
  }
  