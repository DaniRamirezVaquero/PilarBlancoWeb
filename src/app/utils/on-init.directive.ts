import { Directive, OnInit, output } from '@angular/core';

/** Avisa una vez, al crearse el elemento, sin tocar el estado del padre en mitad de la detección de cambios. */
@Directive({ selector: '[appOnInit]', standalone: true })
export class OnInitDirective implements OnInit {
  readonly appOnInit = output<void>();

  ngOnInit(): void {
    queueMicrotask(() => this.appOnInit.emit());
  }
}
