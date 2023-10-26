import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'parametros'
})
// Filtro de buscar
export class ParametrosPipe implements PipeTransform {
  transform(items: any[], filter: { [key: string]: any }): any {
    return items.filter(item => {
      for (const key in filter) {
        if (item[key] !== filter[key]) {
          return false;
        }
      }
      return true;
    });
  }

}
