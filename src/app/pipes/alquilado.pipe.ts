import { Alquilado } from './../models/Alquilado';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'alquilado'
})
export class AlquiladoPipe implements PipeTransform {

  // Filtro de buscar
  transform(value: Alquilado[], arg: any): any {
    if (arg === '' ) return value;
    const resultPosts = [];
    for (const item of value) {
      // IF Solo filtrar en las que se muestran en la table
      if (item.mostrar && item.mostrar.toLowerCase() === 'No') {
        resultPosts.push(item);
        continue;
      }
      if (
        item.codigo_equipo &&
        item.codigo_equipo.toString().toLowerCase().indexOf(arg.toLowerCase()) > -1
      ) {
        resultPosts.push(item);
        continue;
      }
      if (
        item.fecha &&
        item.fecha.toString().toLowerCase().indexOf(arg.toLowerCase()) > -1
      ) {
        resultPosts.push(item);
        continue;
      }
      if (
        item.descripcion &&
        item.descripcion.toString().toLowerCase().indexOf(arg.toLowerCase()) > -1
      ) {
        resultPosts.push(item);
        continue;
      }
      if (
        item.precio &&
        item.precio.toString().toLowerCase().indexOf(arg.toLowerCase()) > -1
      ) {
        resultPosts.push(item);
        continue;
      }
      if (
        item.estado &&
        item.estado.toString().toLowerCase().indexOf(arg.toLowerCase()) > -1
      ) {
        resultPosts.push(item);
        continue;
      }
    }
    return resultPosts;
  }

}
