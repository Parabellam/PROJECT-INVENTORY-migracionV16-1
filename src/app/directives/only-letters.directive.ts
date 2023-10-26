import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appOnlyLetters]'
})
// Validar solo letras en INPUT
export class OnlyLettersDirective {

  @HostListener('input', ['$event'])
  onInputChange(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;
    const currentValue = input.value;
    const newValue = currentValue.replace(/[^a-zA-Z]/g, ' ');

    if (currentValue !== newValue) {
      input.value = newValue;
      event.preventDefault();
    }
  }
}
