/** Aire (px) entre la barra superior y el título de la sección a la que se salta. */
export const ANCHOR_GAP_PX = 16;

/** Sección de la home que se marca como activa en cada página interna. */
const PAGE_SECTION: Readonly<Record<string, string>> = {
  '/voice': 'voz',
  '/video': 'reel',
};

/** Ruta sin query ni fragmento. */
export function pathOf(url: string): string {
  return url.split(/[?#]/)[0];
}

/** Id de la ancla que corresponde a una página interna (null si no tiene). */
export function sectionForPage(url: string): string | null {
  return PAGE_SECTION[pathOf(url)] ?? null;
}

/** `scrollLeft` que deja el enlace centrado en la fila, acotado a su recorrido. */
export function centeredScrollLeft(
  rowWidth: number,
  rowScrollWidth: number,
  linkLeft: number,
  linkWidth: number,
): number {
  const centered = linkLeft + linkWidth / 2 - rowWidth / 2;
  const max = Math.max(0, rowScrollWidth - rowWidth);
  return Math.min(Math.max(0, centered), max);
}

/** Comportamiento de scroll según la preferencia de movimiento reducido. */
export function scrollBehaviorFor(win: Pick<Window, 'matchMedia'> | null | undefined): ScrollBehavior {
  return win?.matchMedia?.('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
}
