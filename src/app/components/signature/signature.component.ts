import {
  ChangeDetectionStrategy, Component, DestroyRef, ElementRef, NgZone, afterNextRender, computed, inject, signal,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import {
  SIGNATURE_APPROVED, SIGNATURE_BOX, SIGNATURE_PREVIEW_PARAM,
  SIGNATURE_PREVIEW_VALUE, SIGNATURE_STROKE_WIDTH, SIGNATURE_SURNAME,
} from '../../data/signature.data';
import { SignatureVectorComponent } from './signature-vector.component';
import { SECTION_IDS } from '../../data/sections.data';
import { RevealWindow, revealOnce } from '../../utils/reveal-once';

/** La firma es pequeña: se escribe cuando ya se ve bien (60 %), no al asomar. */
const SIGNATURE_SHOW_RATIO = 0.6;

/**
 * «La firma» de #contacto: «Pilar Blanco» como en el lockup del CV, en el color del texto. «Pilar» es la
 * firma manuscrita: mientras no esté aprobada, la imagen estática recortada del lockup; aprobada (o con
 * ?firma=trazo), el vector, que se escribe trazo a trazo una sola vez al llegar. «BLANCO» es texto en Lato
 * Light dentro del mismo SVG, así que escala con la firma; en el vector aparece al acabar el último trazo.
 */
@Component({
  selector: 'app-signature',
  standalone: true,
  imports: [SignatureVectorComponent],
  templateUrl: './signature.component.html',
  styleUrl: './signature.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'img',
    'aria-label': 'Pilar Blanco',
    '[class.is-armed]': 'armed()',
    '[class.is-shown]': 'shown()',
    '[style.aspect-ratio]': 'ratio',
    '[style.--sig-surname-delay.ms]': 'surnameDelay()',
  },
})
export class SignatureComponent {
  private readonly approved = inject(SIGNATURE_APPROVED);
  /** Solo en el navegador: ?firma=trazo enseña la versión vectorial antes de aprobarla. */
  private readonly preview = signal(false);
  readonly vector = computed(() => this.approved || this.preview());
  /** true cuando el chunk vectorial ya pintó los trazos: entonces se retira el respaldo estático. */
  readonly vectorDrawn = signal(false);
  readonly armed = signal(false);
  readonly shown = signal(false);

  readonly ratio = `${SIGNATURE_BOX.w} / ${SIGNATURE_BOX.h}`;
  readonly viewBox = `${SIGNATURE_BOX.x} ${SIGNATURE_BOX.y} ${SIGNATURE_BOX.w} ${SIGNATURE_BOX.h}`;
  readonly strokeWidth = SIGNATURE_STROKE_WIDTH;
  readonly surname = SIGNATURE_SURNAME;
  /** Retardo de «BLANCO» (ms): lo da el vector al cargarse, cuando conoce la duración de los trazos. */
  readonly surnameDelay = signal(0);

  protected onVectorDrawn(surnameDelayMs: number): void {
    this.surnameDelay.set(surnameDelayMs);
    this.vectorDrawn.set(true);
  }

  constructor() {
    const host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const zone = inject(NgZone);
    const win = inject(DOCUMENT).defaultView as RevealWindow | null;
    const destroyRef = inject(DestroyRef);
    // Todo en el navegador y tras hidratar: el prerender pinta siempre la firma entera, sin estado oculto.
    afterNextRender(() => {
      const params = new URLSearchParams(win?.location.search ?? '');
      this.preview.set(params.get(SIGNATURE_PREVIEW_PARAM) === SIGNATURE_PREVIEW_VALUE);
      if (!this.vector()) {
        return;
      }
      const handle = revealOnce(host, win, () => zone.run(() => this.shown.set(true)), { showRatio: SIGNATURE_SHOW_RATIO, deepLinkIds: SECTION_IDS });
      this.armed.set(handle.armed);
      destroyRef.onDestroy(() => handle.destroy());
    });
  }
}
