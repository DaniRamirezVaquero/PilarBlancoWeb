import {
  ChangeDetectionStrategy, Component, DestroyRef, ElementRef, NgZone, PLATFORM_ID, afterNextRender, computed, inject, input,
  signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BarLayout, layoutBars } from '../../utils/waveform';

/** Geometría de la onda de fondo: barras de 4 px cada ~12 px, a escala 1:1 como la lista de demos. */
const AIR_LAYOUT: BarLayout = { pitch: 12, width: 4, minBars: 48, heightRatio: 0.8, minHeight: 4 };

/**
 * Onda «en el aire»: la forma de onda de una pista llena su contenedor (la banda de monitor de la home o
 * un fondo) y la parte ya reproducida se ve más intensa. Es decorativa: el estado lo anuncian los
 * controles de la pista.
 *
 * El avance solo anima `transform`: el contenedor de la parte reproducida se desplaza a la izquierda y
 * su contenido, lo mismo a la derecha, así que las barras no se mueven ni se deforman.
 */
@Component({
  selector: 'app-on-air-wave',
  standalone: true,
  template: `
    <svg class="wave wave-rest" [attr.viewBox]="viewBox()" preserveAspectRatio="none" focusable="false">
      @for (bar of bars(); track bar.x) {
        <rect [attr.x]="bar.x" [attr.y]="(box().h - bar.h) / 2" [attr.width]="barWidth" [attr.height]="bar.h" rx="2" />
      }
    </svg>
    <div class="played" [style.transform]="'translateX(-' + shift() + '%)'">
      <svg class="wave wave-played" [style.transform]="'translateX(' + shift() + '%)'" [attr.viewBox]="viewBox()"
        preserveAspectRatio="none" focusable="false">
        @for (bar of bars(); track bar.x) {
          <rect [attr.x]="bar.x" [attr.y]="(box().h - bar.h) / 2" [attr.width]="barWidth" [attr.height]="bar.h" rx="2" />
        }
      </svg>
    </div>
  `,
  styleUrl: './on-air-wave.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'aria-hidden': 'true',
    '[class.is-live]': 'live()',
    '[class.is-measuring]': 'measuring()',
  },
})
export class OnAirWaveComponent {
  /** Picos de la pista (0–100), los mismos de `VoiceDemo.peaks`. */
  readonly peaks = input.required<readonly number[]>();
  /** Avance de la reproducción, de 0 a 1. */
  readonly progress = input(0);
  /** true mientras la pista suena. */
  readonly live = input(false);

  /** Tamaño real en px del contenedor (se actualiza con el ResizeObserver). */
  readonly box = signal({ w: 1200, h: 96 });
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  /**
   * true cuando ya se midió el contenedor (o no hay nada que medir). Al hidratar, el host ya trae las barras
   * del servidor: cuentan como medidas, así que no se ocultan y no parpadean; la medida real solo las reajusta.
   */
  readonly measured = signal(this.isBrowser && this.host.nativeElement.childElementCount > 0);
  readonly barWidth = AIR_LAYOUT.width;

  readonly bars = computed(() => {
    const { w, h } = this.box();
    return layoutBars(this.peaks(), w, h, AIR_LAYOUT);
  });
  readonly viewBox = computed(() => `0 0 ${this.box().w} ${this.box().h}`);
  /** Avance limitado a [0, 1]; NaN cuenta como 0. */
  readonly clamped = computed(() => Math.min(1, Math.max(0, this.progress() || 0)));
  /** Porcentaje que se desplaza la parte reproducida: 100 % sin avance, 0 % al final. */
  readonly shift = computed(() => (1 - this.clamped()) * 100);

  /** Solo si la onda nace en el navegador y hasta la primera medida se oculta; sin JS o en el prerender se ve. */
  readonly measuring = computed(() => this.isBrowser && !this.measured());

  private readonly zone = inject(NgZone);
  private resizeObserver: ResizeObserver | null = null;

  constructor() {
    afterNextRender(() => this.observeSize());
    inject(DestroyRef).onDestroy(() => this.resizeObserver?.disconnect());
  }

  private observeSize(): void {
    if (typeof ResizeObserver === 'undefined') {
      this.measured.set(true);
      return;
    }
    this.resizeObserver = new ResizeObserver(([entry]) => {
      const w = Math.round(entry.contentRect.width);
      const h = Math.round(entry.contentRect.height);
      if (w <= 0 || h <= 0 || (w === this.box().w && h === this.box().h && this.measured())) {
        return;
      }
      this.zone.run(() => {
        this.box.set({ w, h });
        this.measured.set(true);
      });
    });
    this.resizeObserver.observe(this.host.nativeElement);
  }
}
