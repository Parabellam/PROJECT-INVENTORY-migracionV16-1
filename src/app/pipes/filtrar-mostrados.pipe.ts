import { Pipe, PipeTransform } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Pipe({
  name: 'filtrarMostrados',
})
export class FiltrarMostradosPipe implements PipeTransform {
  clienteSeleccionado: string;

  transform(items: any[]): any[] {
    if (!items) {
      return [];
    }
    const clienteSeleccionado = localStorage.getItem('6t9t8gBH896T987t8H0YT796h896979G6RT79g6');
    const sharedSecretCliente =
      'xXry0olWBKA0olBSBKS5eWKASBKABS5eolXWCBA0oWCBKA'; // CLAVE PARA DESENCRIPTAR CLIENTE
    this.clienteSeleccionado = CryptoJS.AES.decrypt(
      clienteSeleccionado,
      sharedSecretCliente
    ).toString(
      // Desencriptamos
      CryptoJS.enc.Utf8
    );

    return items.filter(
      (item) =>
        item.mostrar === 'No' &&
        item.mostrar_cliente === this.clienteSeleccionado
    );
  }
}
