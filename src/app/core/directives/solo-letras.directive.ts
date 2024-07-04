import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: 'input[soloLetras]'
})
export class SoloLetrasDirective {

  constructor(private readonly elRef: ElementRef) { }

  @HostListener('input', ['$event'])
  onChangeInput(event: Event): void {
    const soloLetras = /[^a-zA-Z\s]*/g; // Only letters and spaces
    const initValue = this.elRef.nativeElement.value;
    this.elRef.nativeElement.value = initValue.replace(soloLetras, '');
    if (initValue !== this.elRef.nativeElement.value) {
      event.stopPropagation();
    }
  }
}
