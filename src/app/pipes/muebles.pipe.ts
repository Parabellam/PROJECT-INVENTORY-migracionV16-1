import { Pipe, PipeTransform } from '@angular/core';
import { Muebles } from '../models/muebles';

@Pipe({
  name: 'muebles'
})
export class MueblesPipe implements PipeTransform {

  transform(value: Muebles[], arg: any): any {
    if (arg === '') return value;
    const resultPosts = [];
    for (const item of value) {
      // IF Solo filtrar en las que se muestran en la table
      if (item.mostrar && item.mostrar.toLowerCase() === 'No') {
        resultPosts.push(item);
        continue;
      }
      if (item.codigo_inmueble && item.codigo_inmueble.toString().toLowerCase().indexOf(arg.toLowerCase()) > -1) {
        resultPosts.push(item);
        continue
      };
      if (item.estado && item.estado.toString().toLowerCase().indexOf(arg.toLowerCase()) > -1) {
        resultPosts.push(item);
        continue
      };
      if (item.factura && item.factura.toLowerCase().indexOf(arg.toLowerCase()) > -1) {
        resultPosts.push(item);
        continue
      };
      if (item.fecha_factura && item.fecha_factura.toString().toLowerCase().indexOf(arg.toLowerCase()) > -1) {
        resultPosts.push(item);
        continue
      };
      if (item.observacion && item.observacion.toLowerCase().indexOf(arg.toLowerCase()) > -1) {
        resultPosts.push(item);
        continue
      };
      if (item.precio && item.precio.toString().toLowerCase().indexOf(arg.toLowerCase()) > -1) {
        resultPosts.push(item);
        continue
      };
      if (item.orden && item.orden.toLowerCase().indexOf(arg.toLowerCase()) > -1) {
        resultPosts.push(item);
        continue
      };
    };
    return resultPosts;
  }
}
