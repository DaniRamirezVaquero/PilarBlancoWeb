import {
  Component, ElementRef, Input, NgZone, OnChanges, OnDestroy, PLATFORM_ID, afterNextRender, computed, inject, signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { VoiceDemo } from '../../data/portfolio.data';
import { Bar, layoutBars } from '../../utils/waveform';
import { IconComponent } from '../icon/icon.component';

/**
 * Demos de locución con la forma de onda real de cada MP3. Una sola pista suena a
 * la vez; el audio no se descarga hasta pulsar reproducir.
 *
 * La onda se dibuja a escala 1:1: el viewBox del SVG es el tamaño real de la pista en
 * píxeles, así que las barras miden siempre unos 2px cada ~6px, sin tope de número de
 * barras, y no se deforman en ningún ancho.
 */
@Component({
  selector: 'app-voice-strip',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './voice-strip.component.html',
  styleUrl: './voice-strip.component.css',
  host: { '[class.is-measuring]': 'measuring()' },
})
export class VoiceStripComponent implements OnChanges, OnDestroy {
  @Input({ required: true }) demos: VoiceDemo[] = [];

  readonly playing = signal<number | null>(null);
  readonly active = signal<number | null>(null);
  readonly progress = signal(0);
  readonly loading = signal(false);
  readonly failed = signal<number | null>(null);

  /** Tamaño real en px de la pista (se actualiza con el ResizeObserver). */
  readonly box = signal({ w: 384, h: 48 });
  /** true cuando ya se midió la pista (o no hay nada que medir). */
  readonly measured = signal(false);
  /**
   * Solo en el navegador y hasta la primera medida el SVG se oculta, para no ver el salto al número
   * real de barras. Sin JS, antes de hidratar o en el servidor la onda se ve siempre.
   */
  readonly measuring = computed(() => this.isBrowser && !this.measured());

  readonly barWidth = VoiceStripComponent.BAR_WIDTH_PX;

  private static readonly BAR_PITCH_PX = 6;
  private static readonly BAR_WIDTH_PX = 2;
  private static readonly MIN_BARS = 24;
  private static readonly HEIGHT_RATIO = 0.92;

  private audio: HTMLAudioElement | null = null;
  private audioListeners: AbortController | null = null;
  /** Salto pendiente hasta que carguen los metadatos de la pista; se descarta al cambiar de pista. */
  private pendingSeek: (() => void) | null = null;
  private resizeObserver: ResizeObserver | null = null;
  private readonly zone = inject(NgZone);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  /** Barras de cada demo, en píxeles del viewBox. */
  barsOf: Bar[][] = [];

  constructor() {
    afterNextRender(() => this.observeTrackSize());
  }

  ngOnChanges(): void {
    this.buildBars();
  }

  private buildBars(): void {
    const { w, h } = this.box();
    const { BAR_PITCH_PX, BAR_WIDTH_PX, MIN_BARS, HEIGHT_RATIO } = VoiceStripComponent;
    const layout = { pitch: BAR_PITCH_PX, width: BAR_WIDTH_PX, minBars: MIN_BARS, heightRatio: HEIGHT_RATIO };
    this.barsOf = this.demos.map((demo) => layoutBars(demo.peaks, w, h, layout));
  }

  /** Todas las pistas miden lo mismo: basta con observar la primera. */
  private observeTrackSize(): void {
    const track = this.host.nativeElement.querySelector('.voice-track');
    if (!track || typeof ResizeObserver === 'undefined') {
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
        this.buildBars();
        this.measured.set(true);
      });
    });
    this.resizeObserver.observe(track);
  }

  /** Mensaje para el lector de pantalla: «Cargando…» y los fallos no se oían al estar solo en el texto de la fila. */
  statusMessage(): string {
    const failed = this.failed();
    if (failed !== null) {
      return `No se pudo cargar la demo ${this.demos[failed]?.label ?? ''}`.trim();
    }
    const active = this.active();
    return this.loading() && active !== null ? `Cargando la demo ${this.demos[active]?.label ?? ''}…` : '';
  }

  percent(): number {
    return Math.round(this.progress() * 100);
  }

  format(seconds: number): string {
    const s = Math.max(0, Math.round(seconds));
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  }

  elapsed(index: number, demo: VoiceDemo): string {
    return this.active() === index ? this.format(this.progress() * demo.duration) : this.format(demo.duration);
  }

  toggle(index: number): void {
    const audio = this.ensureAudio();
    if (!audio) {
      return;
    }
    if (this.active() === index && this.playing() === index) {
      audio.pause();
      return;
    }
    if (this.active() !== index) {
      this.cancelPendingSeek();
      audio.src = this.demos[index].url;
      this.active.set(index);
      this.progress.set(0);
    }
    this.failed.set(null);
    this.loading.set(true);
    audio.play().catch((error: unknown) => {
      // Cambiar de pista antes de que suene aborta el play() anterior: no es un fallo de carga.
      if ((error as DOMException | undefined)?.name === 'AbortError' || this.active() !== index) {
        return;
      }
      this.loading.set(false);
      this.failed.set(index);
    });
  }

  /** Pulsar sobre la onda salta a ese punto de la pista. */
  seek(event: MouseEvent, index: number): void {
    const target = event.currentTarget as HTMLElement;
    const ratio = Math.min(1, Math.max(0, (event.clientX - target.getBoundingClientRect().left) / target.offsetWidth));
    if (this.active() !== index) {
      this.toggle(index);
    }
    this.seekToRatio(ratio, index);
  }

  /**
   * Enter/Espacio reproducen o pausan. Flechas ±5 s e Inicio/Fin a los extremos, solo sobre la pista activa:
   * en una inactiva no cargan audio (no se descarga nada por pasar el foco o pulsar una flecha).
   */
  onKeySeek(event: KeyboardEvent, index: number): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.toggle(index);
      return;
    }
    const keys = ['ArrowRight', 'ArrowLeft', 'Home', 'End'];
    if (!keys.includes(event.key)) {
      return;
    }
    event.preventDefault();
    if (this.active() !== index) {
      return;
    }
    const audio = this.audio;
    if (!audio) {
      return;
    }
    const duration = audio.duration || this.demos[index].duration;
    if (event.key === 'Home') {
      audio.currentTime = 0;
    } else if (event.key === 'End') {
      audio.currentTime = duration;
    } else {
      const delta = event.key === 'ArrowRight' ? 5 : -5;
      audio.currentTime = Math.min(duration, Math.max(0, audio.currentTime + delta));
    }
  }

  /** Texto del slider: «0:12 de 0:38»; en una pista inactiva la posición es 0:00. */
  valueText(index: number, demo: VoiceDemo): string {
    const position = this.active() === index ? this.progress() * demo.duration : 0;
    return `${this.format(position)} de ${this.format(demo.duration)}`;
  }

  private seekToRatio(ratio: number, index: number): void {
    const audio = this.audio;
    if (!audio) {
      return;
    }
    const apply = () => {
      if (this.active() === index) {
        audio.currentTime = ratio * (audio.duration || this.demos[index].duration);
      }
    };
    if (audio.readyState >= 1) {
      apply();
      return;
    }
    this.cancelPendingSeek();
    this.pendingSeek = apply;
    audio.addEventListener('loadedmetadata', () => {
      const pending = this.pendingSeek;
      this.pendingSeek = null;
      pending?.();
    }, { once: true, signal: this.audioListeners?.signal });
  }

  private cancelPendingSeek(): void {
    this.pendingSeek = null;
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
    this.cancelPendingSeek();
    this.audioListeners?.abort();
    this.audioListeners = null;
    if (this.audio) {
      this.audio.pause();
      this.audio.removeAttribute('src');
      this.audio.load();
    }
    this.audio = null;
  }

  private ensureAudio(): HTMLAudioElement | null {
    if (!this.isBrowser) {
      return null;
    }
    if (this.audio) {
      return this.audio;
    }
    const audio = new Audio();
    audio.preload = 'none';
    const controller = new AbortController();
    const { signal } = controller;
    audio.addEventListener('playing', () => this.zone.run(() => {
      this.loading.set(false);
      this.playing.set(this.active());
    }), { signal });
    audio.addEventListener('pause', () => this.zone.run(() => this.playing.set(null)), { signal });
    audio.addEventListener('ended', () => this.zone.run(() => {
      this.playing.set(null);
      this.progress.set(1);
    }), { signal });
    audio.addEventListener('error', () => this.zone.run(() => {
      this.loading.set(false);
      this.playing.set(null);
      this.failed.set(this.active());
    }), { signal });
    audio.addEventListener('timeupdate', () => this.zone.run(() => {
      if (audio.duration) {
        this.progress.set(audio.currentTime / audio.duration);
      }
    }), { signal });
    this.audioListeners = controller;
    this.audio = audio;
    return audio;
  }
}
