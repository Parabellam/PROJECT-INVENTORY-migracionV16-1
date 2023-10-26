import { Directive, HostListener, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[appInputFormatNumber]'
})
export class InputFormatNumberDirective {
  @Input('appInputFormatNumber') formatNumber: boolean;

  constructor(private el: ElementRef) {}

  @HostListener('blur') onBlur() {
    if (this.formatNumber) {
      const value = this.el.nativeElement.value;
      this.el.nativeElement.value = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
  }
}
