import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';

/**
 * Highlight directive — adds a hover highlight to table rows.
 * Usage: <tr appHighlight highlightColor="rgba(99,102,241,0.06)">
 */
@Directive({
  selector: '[appHighlight]',
  standalone: true,
})
export class HighlightDirective {
  @Input() highlightColor: string = 'rgba(99,102,241,0.05)';

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('mouseenter')
  onMouseEnter(): void {
    this.renderer.setStyle(this.el.nativeElement, 'background-color', this.highlightColor);
    this.renderer.setStyle(this.el.nativeElement, 'cursor', 'pointer');
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    this.renderer.removeStyle(this.el.nativeElement, 'background-color');
  }
}
