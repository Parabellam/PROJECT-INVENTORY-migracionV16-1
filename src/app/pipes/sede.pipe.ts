import { Pipe, PipeTransform } from '@angular/core';
import { Sede } from '../models/Sede';

@Pipe({
  name: 'sede',
})
export class SedePipe implements PipeTransform {
  // Filtro de buscar
  transform(value: Sede[], arg: any): any {
    if (arg === '') return value;
    const resultPosts = [];
    for (const item of value) {
      // IF Solo filtrar en las que se muestran en la table
      if (item.mostrar && item.mostrar.toLowerCase() === 'No') {
        resultPosts.push(item);
        continue;
      }
      if (
        item.nombre &&
        item.nombre.toString().toLowerCase().indexOf(arg.toLowerCase()) > -1
      ) {
        resultPosts.push(item);
        continue;
      }
      if (
        item.cliente &&
        item.cliente.toString().toLowerCase().indexOf(arg.toLowerCase()) > -1
      ) {
        resultPosts.push(item);
        continue;
      }
    }
    return resultPosts;
  }
}
