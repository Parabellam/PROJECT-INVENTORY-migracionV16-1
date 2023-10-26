import { Asignacion } from './../models/Asignacion';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'asignacion',
})
// Filtro de buscar
export class AsignacionPipe implements PipeTransform {
  transform(value: Asignacion[], arg: any): any {
    if (arg === '') return value;
    const resultPosts = [];
    for (const item of value) {
      // IF Solo filtrar en las que se muestran en la table
      if (item.mostrar && item.mostrar.toLowerCase() === 'No') {
        resultPosts.push(item);
        continue;
      }
      if (
        item.fecha_entrega &&
        item.fecha_entrega.toLowerCase().indexOf(arg.toLowerCase()) > -1
      ) {
        resultPosts.push(item);
        continue;
      }

      if (
        item.sede &&
        item.sede.toString().toLowerCase().indexOf(arg.toLowerCase()) > -1
      ) {
        resultPosts.push(item);
        continue;
      }
      if (
        item.equipo &&
        item.equipo.marca.toString().toLowerCase().indexOf(arg.toLowerCase()) >
          -1
      ) {
        resultPosts.push(item);
        continue;
      }
      if (
        item.funcionario.nombre &&
        item.funcionario.nombre
          .toString()
          .toLowerCase()
          .indexOf(arg.toLowerCase()) > -1
      ) {
        resultPosts.push(item);
        continue;
      }
      if (
        item.descripcion &&
        item.descripcion.toString().toLowerCase().indexOf(arg.toLowerCase()) >
          -1
      ) {
        resultPosts.push(item);
        continue;
      }

      if (
        item.codigo_e_a &&
        item.codigo_e_a.toString().toLowerCase().indexOf(arg.toLowerCase()) > -1
      ) {
        resultPosts.push(item);
        continue;
      }
      if (
        item.tipo &&
        item.tipo.toString().toLowerCase().indexOf(arg.toLowerCase()) > -1
      ) {
        resultPosts.push(item);
        continue;
      }
    }
    return resultPosts;
  }
}
