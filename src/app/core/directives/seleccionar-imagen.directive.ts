import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[seleccionado]'
})
export class SeleccionarImagenDirective {

  constructor(private readonly elRef: ElementRef, private readonly renderer: Renderer2) { }

  @HostListener('click') onClick(): void {
    this.toggleSelected();
  }

  private toggleSelected(): void {
    const isSelected = this.elRef.nativeElement.classList.contains('selected');

    if (isSelected) {
      this.renderer.removeClass(this.elRef.nativeElement, 'selected');
    } else {
      this.renderer.addClass(this.elRef.nativeElement, 'selected');
    }
  }
}
