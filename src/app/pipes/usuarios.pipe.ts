import { Usuario } from 'src/app/models/Usuario';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'usuarios',
})
// Filtro de buscar
export class UsiariosPipe implements PipeTransform {
  transform(value: Usuario[], arg: any): any {
    if (arg === '' ) return value;
    const resultPosts = [];
    for (const item of value) {

      if (
        item.nombre &&
        item.nombre.toLowerCase().indexOf(arg.toLowerCase()) > -1
      ) {
        resultPosts.push(item);
        continue;
      }
      if (
        item.email &&
        item.email.toLowerCase().indexOf(arg.toLowerCase()) > -1
      ) {
        resultPosts.push(item);
        continue;
      }
      if (
        item.password &&
        item.password.toLowerCase().indexOf(arg.toLowerCase()) > -1
      ) {
        resultPosts.push(item);
        continue;
      }
      if (
        item.rol &&
        item.rol.toLowerCase().indexOf(arg.toLowerCase()) > -1
      ) {
        resultPosts.push(item);
        continue;
      }
    }
    return resultPosts;
  }
}
