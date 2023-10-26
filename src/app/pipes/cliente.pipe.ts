import { Pipe, PipeTransform } from '@angular/core';
import { Cliente } from '../models/Cliente';

@Pipe({
  name: 'cliente'
})
export class ClientePipe implements PipeTransform {

  // Filtro de buscar
  transform(value: Cliente[], arg: any): any {
    if (arg === '' ) return value;
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
        item.codigo &&
        item.codigo.toString().toLowerCase().indexOf(arg.toLowerCase()) > -1
      ) {
        resultPosts.push(item);
        continue;
      }
    }
    return resultPosts;
  }

}
