import { Parametros } from './../models/Parametros';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(value: Parametros[], arg: any): any {
    if (arg === '') return value;
    const resultPosts = [];
    for (const item of value) {
      if (item.tipo_parametro && item.tipo_parametro.toLowerCase().indexOf(arg.toLowerCase()) > -1) {
        resultPosts.push(item);
        continue
      };
      if (item.valor && item.valor.toString().toLowerCase().indexOf(arg.toLowerCase()) > -1) {
        resultPosts.push(item);
        continue
      };
      if (item.descripcion && item.descripcion.toLowerCase().indexOf(arg.toLowerCase()) > -1) {
        resultPosts.push(item);
        continue
      };
    };
    return resultPosts;
  }

}

/*
Descripción de tipo de parámetros, nombres, etc
Botón para devolvernos en caso de no querer registrar nuevos parámetro
*/
