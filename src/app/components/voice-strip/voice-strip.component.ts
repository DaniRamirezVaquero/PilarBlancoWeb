import { Component, Input, NgZone, OnChanges, OnDestroy, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { VoiceDemo } from '../../data/portfolio.data';
import { IconComponent } from '../icon/icon.component';

/**
 * Demos de locución como tiras de película con su banda sonora óptica: la forma
 * de onda real de cada MP3. La parte escuchada se marca en rojo. Una sola pista
 * suena a la vez; el audio no se descarga hasta pulsar reproducir.
 */
@Component({
  selector: 'app-voice-strip',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './voice-strip.component.html',
  styleUrl: './voice-strip.component.css',
})
export class VoiceStripComponent implements OnChanges, OnDestroy {
  @Input({ required: true }) demos: VoiceDemo[] = [];

  readonly playing = signal<number | null>(null);
  readonly active = signal<number | null>(null);
  readonly progress = signal(0);
  readonly loading = signal(false);
  readonly failed = signal<number | null>(null);

  private audio: HTMLAudioElement | null = null;
  private readonly zone = inject(NgZone);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  /** Barras simétricas (área variable) de cada demo, a partir de sus picos 0–100. */
  barsOf: { x: number; h: number }[][] = [];

  ngOnChanges(): void {
    // Una barra por cada dos picos (el mayor de la pareja): onda menos densa, misma forma.
    this.barsOf = this.demos.map((demo) =>
      Array.from({ length: Math.ceil(demo.peaks.length / 2) }, (_, j) => ({
        x: j * 8 + 2,
        h: Math.max(2, Math.max(demo.peaks[j * 2], demo.peaks[j * 2 + 1] ?? 0) * 0.44),
      })));
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
      audio.src = this.demos[index].url;
      this.active.set(index);
      this.progress.set(0);
    }
    this.failed.set(null);
    this.loading.set(true);
    audio.play().catch(() => {
      this.loading.set(false);
      this.failed.set(index);
    });
  }

  /** Pulsar sobre la banda óptica salta a ese punto de la pista. */
  seek(event: MouseEvent, index: number): void {
    const target = event.currentTarget as HTMLElement;
    const ratio = Math.min(1, Math.max(0, (event.clientX - target.getBoundingClientRect().left) / target.offsetWidth));
    if (this.active() !== index) {
      this.toggle(index);
    }
    const audio = this.audio;
    if (!audio) {
      return;
    }
    const apply = () => {
      audio.currentTime = ratio * (audio.duration || this.demos[index].duration);
    };
    if (audio.readyState >= 1) {
      apply();
    } else {
      audio.addEventListener('loadedmetadata', apply, { once: true });
    }
  }

  onKeySeek(event: KeyboardEvent, index: number): void {
    if (!this.audio || this.active() !== index) {
      return;
    }
    const delta = event.key === 'ArrowRight' ? 5 : event.key === 'ArrowLeft' ? -5 : 0;
    if (delta !== 0) {
      event.preventDefault();
      this.audio.currentTime = Math.max(0, this.audio.currentTime + delta);
    }
  }

  ngOnDestroy(): void {
    this.audio?.pause();
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
    audio.addEventListener('playing', () => this.zone.run(() => {
      this.loading.set(false);
      this.playing.set(this.active());
    }));
    audio.addEventListener('pause', () => this.zone.run(() => this.playing.set(null)));
    audio.addEventListener('ended', () => this.zone.run(() => {
      this.playing.set(null);
      this.progress.set(1);
    }));
    audio.addEventListener('error', () => this.zone.run(() => {
      this.loading.set(false);
      this.playing.set(null);
      this.failed.set(this.active());
    }));
    audio.addEventListener('timeupdate', () => this.zone.run(() => {
      if (audio.duration) {
        this.progress.set(audio.currentTime / audio.duration);
      }
    }));
    this.audio = audio;
    return audio;
  }
}
