import { Bitacora } from './../models/Bitacora';
import { Pipe, PipeTransform } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Pipe({
  name: 'codEquipo2',
})
export class CodEquipo2Pipe implements PipeTransform {
  clienteSeleccionado: string;

  transform(value: Bitacora[], arg: any): any {
    if (arg === '') return value;
    const resultPosts = [];

    const clienteSeleccionado = localStorage.getItem(
      '6t9t8gBH896T987t8H0YT796h896979G6RT79g6'
    );
    const sharedSecretCliente =
      'xXry0olWBKA0olBSBKS5eWKASBKABS5eolXWCBA0oWCBKA'; // CLAVE PARA DESENCRIPTAR CLIENTE
    this.clienteSeleccionado = CryptoJS.AES.decrypt(
      clienteSeleccionado,
      sharedSecretCliente
    ).toString(
      // Desencriptamos
      CryptoJS.enc.Utf8
    );
    for (const item of value) {
      if (
        item.mostrar_cliente &&
        item.mostrar_cliente.toLowerCase() === this.clienteSeleccionado
      ) {
        resultPosts.push(item);
        continue;
      }

      if (
        item.codigoEquipo &&
        item.codigoEquipo.toString().toLowerCase().indexOf(arg.toLowerCase()) >
          -1
      ) {
        resultPosts.push(item);
        continue;
      }
    }
    return resultPosts;
  }
}
