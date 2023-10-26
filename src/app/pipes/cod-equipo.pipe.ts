import { Bitacora } from './../models/Bitacora';
import { Pipe, PipeTransform } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Pipe({
  name: 'codEquipo',
})
export class CodEquipoPipe implements PipeTransform {
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
      if (item.codigoEquipo && item.codigoEquipo.substring(0, 2) === arg) {
        resultPosts.push(item);
        continue;
      }
    }
    return resultPosts;
  }
}
