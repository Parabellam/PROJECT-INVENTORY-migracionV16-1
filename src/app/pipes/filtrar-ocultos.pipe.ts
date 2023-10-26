import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtrarOcultos'
})
export class FiltrarOcultosPipe implements PipeTransform {

  transform(items: any[]): any[] {
    if (!items) {
      return [];
    }
    return items.filter((item) => item.mostrar === 'Si');
  }
}
