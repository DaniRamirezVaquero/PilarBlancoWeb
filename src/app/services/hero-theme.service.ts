import { Injectable, effect, signal } from '@angular/core';

/** Claves de las cubiertas del hero; los ficheros viven en assets/images/hero/<key>-<width>.webp */
export const HERO_COVERS = ['fondo2', 'portada'] as const;
export type HeroCover = typeof HERO_COVERS[number];

const HERO_THEMES: Record<HeroCover, string> = {
  fondo2: 'mytheme',
  portada: 'mytheme-portada',
};

/** Deben coincidir con el script inline de index.html */
export const HERO_COVER_SESSION_KEY = 'hero-cover';
export const HERO_COVER_LAST_KEY = 'hero-cover-last';

@Injectable({
  providedIn: 'root'
})
export class HeroThemeService {
  readonly covers = HERO_COVERS;
  readonly currentCoverIndex = signal(resolveHeroCoverIndex());

  constructor() {
    effect(() => {
      this.currentCoverIndex();
      this.applyTheme();
    });
  }

  currentCover(): HeroCover {
    return this.covers[this.currentCoverIndex()];
  }

  currentTheme(): string {
    return HERO_THEMES[this.currentCover()];
  }

  private applyTheme(): void {
    if (typeof document === 'undefined') {
      return;
    }
    document.documentElement.setAttribute('data-theme', this.currentTheme());
    document.documentElement.setAttribute('data-hero', this.currentCover());
  }
}

function isHeroCover(value: string | null): value is HeroCover {
  return value !== null && (HERO_COVERS as readonly string[]).includes(value);
}

function safeGet(storage: Storage, key: string): string | null {
  try {
    return storage.getItem(key);
  } catch {
    return null;
  }
}

function safeSet(storage: Storage, key: string, value: string): void {
  try {
    storage.setItem(key, value);
  } catch {
    // Safari en modo privado puede rechazar Storage.
  }
}

/** Cubierta de esta pestaña: estable hasta cerrarla; la siguiente visita usa la otra. */
export function resolveHeroCoverIndex(): number {
  if (typeof window === 'undefined') {
    return 0;
  }

  const sessionCover = safeGet(sessionStorage, HERO_COVER_SESSION_KEY);
  if (isHeroCover(sessionCover)) {
    return HERO_COVERS.indexOf(sessionCover);
  }

  const lastCover = safeGet(localStorage, HERO_COVER_LAST_KEY);
  const nextIndex = isHeroCover(lastCover)
    ? (HERO_COVERS.indexOf(lastCover) + 1) % HERO_COVERS.length
    : 0;
  const nextCover = HERO_COVERS[nextIndex];

  safeSet(sessionStorage, HERO_COVER_SESSION_KEY, nextCover);
  safeSet(localStorage, HERO_COVER_LAST_KEY, nextCover);
  return nextIndex;
}
