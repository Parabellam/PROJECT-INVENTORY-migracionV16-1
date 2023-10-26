import { Bitacora } from './../models/Bitacora';
import { Pipe, PipeTransform } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Pipe({
  name: 'bitacora',
})
export class BitacoraPipe implements PipeTransform {
  clienteSeleccionado: string;
  // Filtro de buscar
  transform(value: Bitacora[], arg: any): any {
    if (arg === '') return value;
    const resultPosts = [];
    for (const item of value) {
      if (
        item.mostrar_cliente &&
        item.mostrar_cliente.toLowerCase() === this.clienteSeleccionado
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
        item.actividad &&
        item.actividad.toLowerCase().indexOf(arg.toLowerCase()) > -1
      ) {
        resultPosts.push(item);
        continue;
      }
    }
    return resultPosts;
  }
}
