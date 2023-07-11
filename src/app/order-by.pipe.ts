// orderBy.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orderBy'
})
export class OrderByPipe implements PipeTransform {
  transform(array: any[], column: string, direction: string): any[] {
    if (!array || !column || !direction) {
      return array;
    }

    const compareFn = this.getCompareFn(direction);

    return array.sort((a, b) => {
      const aValue = a[column];
      const bValue = b[column];
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return compareFn(aValue, bValue);
      } else {
        return compareFn(parseFloat(aValue), parseFloat(bValue));
      }
    });
  }

  private getCompareFn(direction: string): (a: any, b: any) => number {
    if (direction === 'asc') {
      return (a, b) => a.localeCompare(b);
    } else {
      return (a, b) => b.localeCompare(a);
    }
  }
}