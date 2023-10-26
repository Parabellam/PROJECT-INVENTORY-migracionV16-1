import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'distinct'
})
export class DistinctPipe implements PipeTransform {
  transform(value: any[]): any[] {
    if (!Array.isArray(value)) {
      return value;
    }

    return value.filter((item, index) => value.indexOf(item) === index);
  }
}
