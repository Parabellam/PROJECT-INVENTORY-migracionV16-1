import { Equipo } from '../models/Equipo';
import { Pipe, PipeTransform } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Pipe({
  name: 'equipo',
})
// Filtro de buscar
export class EquipoPipe implements PipeTransform {
  clienteSeleccionado: string;
  transform(value: Equipo[], arg: any): any {
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
      // IF Solo filtrar en las que se muestran en la table
      if (item.mostrar && item.mostrar.toLowerCase() === 'No') {
        resultPosts.push(item);
        continue;
      }

      if (
        item.codigo_equipo &&
        item.codigo_equipo.toString().toLowerCase().indexOf(arg.toLowerCase()) >
          -1
      ) {
        resultPosts.push(item);
        continue;
      }
      if (
        item.parametros.tipo_parametro &&
        item.parametros.tipo_parametro
          .toString()
          .toLowerCase()
          .indexOf(arg.toLowerCase()) > -1
      ) {
        resultPosts.push(item);
        continue;
      }
      if (
        item.tiket &&
        item.tiket.toString().toLowerCase().indexOf(arg.toLowerCase()) > -1
      ) {
        resultPosts.push(item);
        continue;
      }
      if (
        item.marca &&
        item.marca.toLowerCase().indexOf(arg.toLowerCase()) > -1
      ) {
        resultPosts.push(item);
        continue;
      }
      if (
        item.modelo &&
        item.modelo.toLowerCase().indexOf(arg.toLowerCase()) > -1
      ) {
        resultPosts.push(item);
        continue;
      }
      if (
        item.procesador &&
        item.procesador.toLowerCase().indexOf(arg.toLowerCase()) > -1
      ) {
        resultPosts.push(item);
        continue;
      }
      if (item.os && item.os.toLowerCase().indexOf(arg.toLowerCase()) > -1) {
        resultPosts.push(item);
        continue;
      }
      if (item.ram && item.ram.toLowerCase().indexOf(arg.toLowerCase()) > -1) {
        resultPosts.push(item);
        continue;
      }
      if (
        item.observaciones &&
        item.observaciones.toLowerCase().indexOf(arg.toLowerCase()) > -1
      ) {
        resultPosts.push(item);
        continue;
      }
      if (
        item.estado &&
        item.estado.toLowerCase().indexOf(arg.toLowerCase()) > -1
      ) {
        resultPosts.push(item);
        continue;
      }
      if (
        item.seriall &&
        item.seriall.toLowerCase().indexOf(arg.toLowerCase()) > -1
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
        item.parametros &&
        item.parametros.toString().toLowerCase().indexOf(arg.toLowerCase()) > -1
      ) {
        resultPosts.push(item);
        continue;
      }
      if (
        item.fecha_factura &&
        item.fecha_factura.toString().toLowerCase().indexOf(arg.toLowerCase()) >
          -1
      ) {
        resultPosts.push(item);
        continue;
      }
      if (
        item.almacenamiento &&
        item.almacenamiento.toLowerCase().indexOf(arg.toLowerCase()) > -1
      ) {
        resultPosts.push(item);
        continue;
      }
      if (
        item.factura &&
        item.factura.toLowerCase().indexOf(arg.toLowerCase()) > -1
      ) {
        resultPosts.push(item);
        continue;
      }
      if (
        item.orden &&
        item.orden.toLowerCase().indexOf(arg.toLowerCase()) > -1
      ) {
        resultPosts.push(item);
        continue;
      }
    }
    return resultPosts;
  }
}
