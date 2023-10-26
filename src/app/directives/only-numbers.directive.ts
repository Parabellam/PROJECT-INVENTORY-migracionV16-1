import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appOnlyNumbers]'
})
//Validar solo números en INPUT
export class OnlyNumbersDirective {

  @HostListener('input', ['$event'])
  onInputChange(event: KeyboardEvent) {
    const initalValue = (event.target as HTMLInputElement).value;
    (event.target as HTMLInputElement).value = initalValue.replace(/[^0-9+]*/g, '');
    if (initalValue !== (event.target as HTMLInputElement).value) {
      event.preventDefault();
    }
  }
}
