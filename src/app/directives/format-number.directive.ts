import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[appFormatNumber]'
})
// Separar miles por puntos (.) EN LA TABLA (FRONT)
export class FormatNumberDirective {
  @Input() appFormatNumber: number;

  constructor(private el: ElementRef) { }

  ngOnInit() {
    this.el.nativeElement.textContent = this.formatNumber(this.appFormatNumber);
  }

  formatNumber(num: number): string {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }
}
