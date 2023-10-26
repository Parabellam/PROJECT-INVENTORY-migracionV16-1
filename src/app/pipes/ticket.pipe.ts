import { Pipe, PipeTransform } from '@angular/core';
import { Ticket } from '../models/Ticket';

@Pipe({
  name: 'ticket',
})
export class TicketPipe implements PipeTransform {
  // Filtro de buscar
  transform(value: Ticket[], arg: any): any {
    if (arg === '') return value;
    const resultPosts = [];
    for (const item of value) {
      if (
        item.numeroTicket &&
        item.numeroTicket.toString().toLowerCase().indexOf(arg.toLowerCase()) >
          -1
      ) {
        resultPosts.push(item);
        continue;
      }
      if (
        item.usuario &&
        item.usuario.toString().toLowerCase().indexOf(arg.toLowerCase()) > -1
      ) {
        resultPosts.push(item);
        continue;
      }
      if (
        item.correo &&
        item.correo.toString().toLowerCase().indexOf(arg.toLowerCase()) > -1
      ) {
        resultPosts.push(item);
        continue;
      }
      if (
        item.problema &&
        item.problema.toString().toLowerCase().indexOf(arg.toLowerCase()) > -1
      ) {
        resultPosts.push(item);
        continue;
      }
      if (
        item.departamento &&
        item.departamento.toString().toLowerCase().indexOf(arg.toLowerCase()) >
          -1
      ) {
        resultPosts.push(item);
        continue;
      }
      if (
        item.fechaIngreso &&
        item.fechaIngreso.toString().toLowerCase().indexOf(arg.toLowerCase()) >
          -1
      ) {
        resultPosts.push(item);
        continue;
      }
      if (
        item.prioridad &&
        item.prioridad.toString().toLowerCase().indexOf(arg.toLowerCase()) > -1
      ) {
        resultPosts.push(item);
        continue;
      }
      if (
        item.enviadoVia &&
        item.enviadoVia.toString().toLowerCase().indexOf(arg.toLowerCase()) > -1
      ) {
        resultPosts.push(item);
        continue;
      }
      if (
        item.asunto &&
        item.asunto.toString().toLowerCase().indexOf(arg.toLowerCase()) > -1
      ) {
        resultPosts.push(item);
        continue;
      }
      if (
        item.asignadoA &&
        item.asignadoA.toString().toLowerCase().indexOf(arg.toLowerCase()) > -1
      ) {
        resultPosts.push(item);
        continue;
      }
      if (
        item.respuesta &&
        item.respuesta.toString().toLowerCase().indexOf(arg.toLowerCase()) > -1
      ) {
        resultPosts.push(item);
        continue;
      }
      if (
        item.estadoFinal &&
        item.estadoFinal.toString().toLowerCase().indexOf(arg.toLowerCase()) >
          -1
      ) {
        resultPosts.push(item);
        continue;
      }
      if (
        item.fechaCierre &&
        item.fechaCierre.toString().toLowerCase().indexOf(arg.toLowerCase()) >
          -1
      ) {
        resultPosts.push(item);
        continue;
      }
      if (
        item.fechaActualizacion &&
        item.fechaActualizacion
          .toString()
          .toLowerCase()
          .indexOf(arg.toLowerCase()) > -1
      ) {
        resultPosts.push(item);
        continue;
      }
    }
    return resultPosts;
  }
}
