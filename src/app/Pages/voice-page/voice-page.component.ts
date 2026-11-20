import {
  ChangeDetectionStrategy, Component, DestroyRef, ElementRef, NgZone, afterNextRender, computed, inject, signal,
  viewChildren, viewChild,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { VoiceStripComponent } from '../../components/voice-strip/voice-strip.component';
import { VimeoFacadeComponent } from '../../components/vimeo-facade/vimeo-facade.component';
import { OnAirWaveComponent } from '../../components/on-air/on-air-wave.component';
import { OnAirPilotComponent } from '../../components/on-air/on-air-pilot.component';
import { DUBBING, VOICE, Video } from '../../data/portfolio.data';
import { CENTERED, DUBBING_FRAMING, DUBBING_LINES, PosterFraming } from '../../data/screens.data';
import { REVEAL_ARM_RATIO, RevealHandle, RevealWindow, revealOnce } from '../../utils/reveal-once';

/** Fracción visible de cada demo de doblaje que hace aparecer su frase. */
const DUB_SHOW_RATIO = 0.5;

/**
 * /voice: el doblaje con «subtítulo protagonista» (la pantalla recortada para ocultar el subtítulo quemado y la
 * frase en grande debajo) y la locución «en el aire» (la onda de la demo cargada de fondo y el piloto).
 */
@Component({
  selector: 'app-voice-page',
  imports: [VoiceStripComponent, VimeoFacadeComponent, OnAirWaveComponent, OnAirPilotComponent],
  templateUrl: './voice-page.component.html',
  styleUrls: ['./voice-page.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VoicePageComponent {
  readonly dubbing = DUBBING;
  readonly voice = VOICE;

  /**
   * Estado previo a la entrada de las frases (ocultas). Solo lo pone el JS en el navegador y sin movimiento
   * reducido: el prerender y el modo sin JS ven las frases.
   */
  readonly armed = signal(false);
  /** Frases ya mostradas, una por demo. Cada una aparece una sola vez. */
  readonly shown = signal<readonly boolean[]>(DUBBING.map(() => false));

  private readonly strip = viewChild(VoiceStripComponent);
  /** Pista que muestra la onda de fondo: la activa o, en reposo, la primera. */
  readonly airDemo = computed(() => this.voice[this.strip()?.active() ?? 0] ?? this.voice[0]);
  /** Avance de la pista activa; en reposo, 0. */
  readonly airProgress = computed(() => {
    const strip = this.strip();
    return strip && strip.active() !== null ? strip.progress() : 0;
  });
  /** true mientras suena una demo: enciende el piloto. */
  readonly airLive = computed(() => this.strip()?.playing() != null);

  private readonly dubEls = viewChildren<ElementRef<HTMLElement>>('dub');
  private readonly document = inject(DOCUMENT);
  private readonly zone = inject(NgZone);

  constructor() {
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      const handles = this.armLines();
      destroyRef.onDestroy(() => handles.forEach((handle) => handle.destroy()));
    });
  }

  line(video: Video): string {
    return DUBBING_LINES[video.videoId] ?? '';
  }

  framing(video: Video): PosterFraming {
    return DUBBING_FRAMING[video.videoId] ?? CENTERED;
  }

  /** Una entrada de una vez por demo: la frase aparece de corte, como un subtítulo, al verse media pantalla. */
  private armLines(): RevealHandle[] {
    const win = this.document.defaultView as RevealWindow | null;
    const handles = this.dubEls().map((ref, i) => revealOnce(ref.nativeElement, win, (reason) => {
      this.zone.run(() => {
        // Si se activa el movimiento reducido con la entrada armada, se desarma: todo queda visible y quieto.
        if (reason === 'reduced-motion') {
          this.armed.set(false);
        }
        this.shown.update((shown) => shown.map((value, k) => (k === i ? true : value)));
      });
    }, { armRatio: REVEAL_ARM_RATIO, showRatio: DUB_SHOW_RATIO }));
    // Las demos que ya se ven al cargar no se arman: cuentan como mostradas.
    this.shown.set(handles.map((handle) => !handle.armed));
    this.armed.set(handles.some((handle) => handle.armed));
    return handles;
  }
}
