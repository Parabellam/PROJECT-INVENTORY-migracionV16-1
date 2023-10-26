import { Pipe, PipeTransform } from '@angular/core';
import { Licencia } from '../models/Licencia';

@Pipe({
  name: 'licencia'
})
export class LicenciaPipe implements PipeTransform {

  // Filtro de buscar
  transform(value: Licencia[], arg: any): any {
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
        item.version &&
        item.version.toString().toLowerCase().indexOf(arg.toLowerCase()) > -1
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
        item.factura &&
        item.factura.toString().toLowerCase().indexOf(arg.toLowerCase()) > -1
      ) {
        resultPosts.push(item);
        continue;
      }
      if (
        item.orden_compra &&
        item.orden_compra.toString().toLowerCase().indexOf(arg.toLowerCase()) > -1
      ) {
        resultPosts.push(item);
        continue;
      }
      if (
        item.fabricante &&
        item.fabricante.toString().toLowerCase().indexOf(arg.toLowerCase()) > -1
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
