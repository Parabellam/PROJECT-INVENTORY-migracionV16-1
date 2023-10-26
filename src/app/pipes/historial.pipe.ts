import { Historial } from './../models/Historial';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'historial'
})
export class HistorialPipe implements PipeTransform {

  transform(value: Historial[], arg: any): any {
    if (arg === '') return value;
    const resultPosts = [];
    for (const item of value) {

      if (item.fecha && item.fecha.toString().toLowerCase().indexOf(arg.toLowerCase()) > -1) {
        resultPosts.push(item);
        continue
      };
      if (item.usuario && item.usuario.toString().toLowerCase().indexOf(arg.toLowerCase()) > -1) {
        resultPosts.push(item);
        continue
      };
    };
    return resultPosts;
  }

}
