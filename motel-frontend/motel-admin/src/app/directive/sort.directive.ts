import { Directive, EventEmitter, HostListener, Input, Output } from '@angular/core';

export type SortColumn = keyof any | '';
export type SortDirection = 'asc' | 'desc' | '';
const rotate: { [key: string]: SortDirection } = { 'asc': 'desc', 'desc': '', '': 'asc' };

@Directive({
  selector: 'th[appSort]',
})
export class SortDirective {
  @Input() appSort: SortColumn = '';
  @Input() direction: SortDirection = '';
  @Output() sort = new EventEmitter<{ column: SortColumn, direction: SortDirection }>();

  rotate() {
    this.direction = rotate[this.direction];
  }

  @HostListener('click') onClick() {
    if (this.appSort) {
      this.rotate();
      this.sort.emit({ column: this.appSort, direction: this.direction });
    }
  }
}
