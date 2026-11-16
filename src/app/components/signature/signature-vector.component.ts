import { ChangeDetectionStrategy, Component, afterNextRender, input, output } from '@angular/core';
import {
  SIGNATURE_FIRST_STROKE_DELAY_MS, SIGNATURE_PAUSE_MS, SIGNATURE_STROKES, SIGNATURE_SURNAME_PAUSE_MS,
} from '../../data/signature-strokes.data';

/** Cada trazo empieza cuando acaba el anterior, con una pausa breve entre medias. */
const TIMED_STROKES = SIGNATURE_STROKES.map((stroke, i, all) => ({
  ...stroke,
  delay: SIGNATURE_FIRST_STROKE_DELAY_MS + all.slice(0, i).reduce((sum, prev) => sum + prev.ms + SIGNATURE_PAUSE_MS, 0),
}));

/** «BLANCO» entra cuando acaba el último trazo (el punto de la «i»), tras una pausa breve. */
const LAST = TIMED_STROKES[TIMED_STROKES.length - 1];
export const SIGNATURE_SURNAME_DELAY_MS =
  (LAST ? LAST.delay + LAST.ms : SIGNATURE_FIRST_STROKE_DELAY_MS) + SIGNATURE_SURNAME_PAUSE_MS;

/**
 * Trazos vectoriales de «Pilar», dentro del SVG de `app-signature`. Está aparte, en un `@defer`, para que sus
 * ~5 kB de trazado y de tiempos no entren en el bundle inicial: solo se descarga si la firma está aprobada o
 * con ?firma=trazo. Sus estilos (stroke-dashoffset, la excepción aprobada) cuelgan de `app-signature.is-armed`.
 */
@Component({
  selector: 'g[app-signature-vector]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './signature-vector.component.css',
  template: `
    @for (stroke of strokes; track stroke.name) {
      <svg:path class="sig-stroke" [attr.d]="stroke.d" pathLength="1" [attr.stroke-width]="strokeWidth()"
        [style.--sig-ms.ms]="stroke.ms" [style.--sig-delay.ms]="stroke.delay" />
    }
  `,
})
export class SignatureVectorComponent {
  readonly strokeWidth = input.required<number>();
  /** Avisa de que el vector ya está en pantalla y de cuándo debe entrar «BLANCO» (ms). */
  readonly drawn = output<number>();
  protected readonly strokes = TIMED_STROKES;

  constructor() {
    afterNextRender(() => this.drawn.emit(SIGNATURE_SURNAME_DELAY_MS));
  }
}
