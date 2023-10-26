import { Pipe, PipeTransform } from '@angular/core';
import { Funcionario } from '../models/Funcionario';

@Pipe({
  name: 'funcionario',
})
// Filtro de buscar
export class FuncionarioPipe implements PipeTransform {
  transform(value: Funcionario[], arg: any): any {
    if (arg === '') return value;
    const resultPosts = [];
    for (const item of value) {
      // IF Solo filtrar en las que se muestran en la table
      if (item.mostrar && item.mostrar.toLowerCase() === 'No') {
        resultPosts.push(item);
        continue;
      }
      if (
        item.documento &&
        item.documento.toString().toLowerCase().indexOf(arg.toLowerCase()) > -1
      ) {
        resultPosts.push(item);
        continue;
      }
      if (
        item.nombre &&
        item.nombre.toLowerCase().indexOf(arg.toLowerCase()) > -1
      ) {
        resultPosts.push(item);
        continue;
      }
      if (
        item.email &&
        item.email.toLowerCase().indexOf(arg.toLowerCase()) > -1
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
        item.celular &&
        item.celular.toLowerCase().indexOf(arg.toLowerCase()) > -1
      ) {
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
        item.mostrar &&
        item.mostrar.toLowerCase().indexOf(arg.toLowerCase()) > -1
      ) {
        resultPosts.push(item);
        continue;
      }
    }
    return resultPosts;
  }
}
