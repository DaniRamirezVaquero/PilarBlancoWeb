import { Injectable, effect, inject, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

/** Claves de las cubiertas del hero; los ficheros viven en assets/images/hero/<key>-<width>.webp */
export const HERO_COVERS = ['fondo2', 'portada'] as const;
export type HeroCover = typeof HERO_COVERS[number];

const HERO_THEMES: Record<HeroCover, string> = {
  fondo2: 'mytheme',
  portada: 'mytheme-portada',
};

const COVER_INTERVAL_MS = 30 * 60 * 1000;
const HOME_APPLY_DELAY_MS = 3 * 1000;

@Injectable({
  providedIn: 'root'
})
export class HeroThemeService {
  readonly covers = HERO_COVERS;
  readonly currentCoverIndex = signal(this.indexFromClock());

  private readonly router = inject(Router);

  private coverTimeoutId: ReturnType<typeof setTimeout> | null = null;
  private coverIntervalId: ReturnType<typeof setInterval> | null = null;
  private applyTimeoutId: ReturnType<typeof setTimeout> | null = null;
  private pendingAdvance = false;
  private onHome = false;

  constructor() {
    effect(() => {
      this.currentCoverIndex();
      this.applyTheme();
    });

    if (typeof window === 'undefined') {
      return;
    }

    this.onHome = this.isHomeUrl(this.router.url);
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe(event => this.onNavigation(event.urlAfterRedirects));

    this.scheduleCoverRotation();
  }

  currentCover(): HeroCover {
    return this.covers[this.currentCoverIndex()];
  }

  currentTheme(): string {
    return HERO_THEMES[this.currentCover()];
  }

  private isHomeUrl(url: string): boolean {
    const path = url.split('?')[0].split('#')[0];
    return path === '/home' || path === '/' || path === '';
  }

  private onNavigation(url: string): void {
    const wasOnHome = this.onHome;
    this.onHome = this.isHomeUrl(url);

    if (!this.onHome) {
      this.clearApplyTimeout();
      return;
    }

    if (this.pendingAdvance && !wasOnHome) {
      this.queueApplyOnHome();
    }
  }

  private indexFromClock(): number {
    return Math.floor(Date.now() / COVER_INTERVAL_MS) % HERO_COVERS.length;
  }

  private scheduleCoverRotation(): void {
    const remainingMs = COVER_INTERVAL_MS - (Date.now() % COVER_INTERVAL_MS);

    this.coverTimeoutId = setTimeout(() => {
      this.requestAdvance();
      this.coverIntervalId = setInterval(() => this.requestAdvance(), COVER_INTERVAL_MS);
    }, remainingMs);
  }

  /** El slot de reloj ha caducado: solo se aplica en /home, y con 3 s de margen. */
  private requestAdvance(): void {
    this.pendingAdvance = true;
    if (this.onHome) {
      this.queueApplyOnHome();
    }
  }

  private queueApplyOnHome(): void {
    this.clearApplyTimeout();
    this.applyTimeoutId = setTimeout(() => {
      this.applyTimeoutId = null;
      if (!this.onHome || !this.pendingAdvance) {
        return;
      }
      this.commitAdvance();
    }, HOME_APPLY_DELAY_MS);
  }

  private commitAdvance(): void {
    const next = this.indexFromClock();
    if (next !== this.currentCoverIndex()) {
      this.currentCoverIndex.set(next);
    }
    this.pendingAdvance = false;
  }

  private clearApplyTimeout(): void {
    if (this.applyTimeoutId) {
      clearTimeout(this.applyTimeoutId);
      this.applyTimeoutId = null;
    }
  }

  private applyTheme(): void {
    if (typeof document === 'undefined') {
      return;
    }
    document.documentElement.setAttribute('data-theme', this.currentTheme());
  }
}
