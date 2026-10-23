import { Component, Input } from '@angular/core';

/**
 * Círculo de lápiz graso rojo: la marca con la que se elige un fotograma en la
 * hoja de contactos. Dos pasadas de trazo irregular; se dibuja (stroke-dashoffset)
 * cuando `drawn` pasa a true. Es la única marca roja activa de cada zona.
 */
@Component({
  selector: 'app-pencil-ring',
  standalone: true,
  template: `
    <svg viewBox="0 0 200 140" preserveAspectRatio="none" aria-hidden="true" focusable="false"
      [class.is-drawn]="drawn" [style.--ring-delay]="delay + 'ms'">
      <path pathLength="1"
        d="M104 9C58 5 15 24 9 63c-6 43 41 69 95 68 55-1 89-27 87-64C189 27 150 7 96 12 72 14 52 21 41 30" />
      <path pathLength="1" class="second"
        d="M38 33c-14 12-24 28-22 46 4 33 44 52 92 50" />
    </svg>
  `,
  styles: [`
    :host { position: absolute; inset: -9% -7%; pointer-events: none; display: block; z-index: 3; }
    svg { width: 100%; height: 100%; overflow: visible; }
    path {
      fill: none; stroke: var(--pencil); stroke-width: 5.5; stroke-linecap: round; stroke-linejoin: round;
      vector-effect: non-scaling-stroke; stroke-dasharray: 1; stroke-dashoffset: 1; opacity: .96;
    }
    .second { stroke-width: 3.5; opacity: .75; }
    .is-drawn path { stroke-dashoffset: 0; transition: stroke-dashoffset .9s cubic-bezier(.65,0,.35,1) var(--ring-delay, 0ms); }
    .is-drawn .second { transition-delay: calc(var(--ring-delay, 0ms) + .55s); transition-duration: .35s; }
  `],
})
export class PencilRingComponent {
  @Input() drawn = true;
  /** Retraso del trazo en ms (para orquestar la apertura del inicio). */
  @Input() delay = 0;
}
