import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[appSeparateThousands]',
})
//Separar miles por puntos (.) EN EL INPUT (Editar y registrar)
export class SeparateThousandsDirective {
  private el: HTMLInputElement;

  constructor(private elementRef: ElementRef) {
    this.el = this.elementRef.nativeElement;
  }

  @HostListener('input', ['$event'])
  onInputChange(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;
    const currentValue = input.value;
    const newValue = this.separateThousands(currentValue);

    if (currentValue !== newValue) {
      input.value = newValue;
      event.preventDefault();
    }
  }

  private separateThousands(value: string): string {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }
}
