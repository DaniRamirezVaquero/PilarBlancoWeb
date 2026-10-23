import { Component, Input } from '@angular/core';

/**
 * Círculo de lápiz graso rojo: la marca con la que se elige un fotograma en la
 * hoja de contactos. Un solo trazo que rodea la foto y se pasa de su inicio, como
 * a mano; se dibuja (stroke-dashoffset) cuando `drawn` pasa a true. Ciñe la foto
 * sin tapar el código de borde ni salirse de la tira.
 */
@Component({
  selector: 'app-pencil-ring',
  standalone: true,
  template: `
    <svg viewBox="0 0 200 200" preserveAspectRatio="none" aria-hidden="true" focusable="false"
      [class.is-drawn]="drawn" [style.--ring-delay]="delay + 'ms'">
      <path pathLength="1"
        d="M70 13C126 1 190 26 192 86c2 62-36 106-96 106C38 192 7 150 9 96 11 46 44 12 116 9" />
    </svg>
  `,
  styles: [`
    :host { position: absolute; inset: -4.5% -5.5%; pointer-events: none; display: block; z-index: 3; }
    svg { width: 100%; height: 100%; overflow: visible; transform: rotate(-2.5deg); }
    path {
      fill: none; stroke: var(--pencil); stroke-width: 4.5; stroke-linecap: round; stroke-linejoin: round;
      stroke-dasharray: 1; stroke-dashoffset: 1;
      filter: drop-shadow(0 1px 0 rgb(0 0 0 / 0.25));
    }
    .is-drawn path { stroke-dashoffset: 0; transition: stroke-dashoffset 0.85s cubic-bezier(.65,0,.35,1) var(--ring-delay, 0ms); }
  `],
})
export class PencilRingComponent {
  @Input() drawn = true;
  /** Retraso del trazo en ms (para orquestar la apertura del inicio). */
  @Input() delay = 0;
}
