import { Directive, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { Equipo } from '../models/Equipo';

@Directive({
  selector: '[searchableSelect]'
})
export class SearchableSelectDirective {
  @Input() options: string[];
  @Output() optionSelected = new EventEmitter<string>();

  private searchValue = '';
  private isOpen = false;
  private equipo: any[] ;

  constructor(private elRef: ElementRef) {}

  @HostListener('document:click', ['$event'])
  onClick(event: Event) {
    if (!this.elRef.nativeElement.contains(event.target)) {
      this.isOpen = false;
    }
  }

  @HostListener('click')
  onToggle() {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      setTimeout(() => {
        const searchInput = this.elRef.nativeElement.querySelector('.search-input');
        searchInput.focus();
      });
    }
  }

  onSearchValueChange(value: string) {
    this.searchValue = value;
    this.equipo = this.options.filter(option => option.toLowerCase().includes(value.toLowerCase()));
  }


}
