import { prefersReducedMotion } from './motion';

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

/** true si la URL actual es exactamente la ruta indicada (para enlaces de ruta como «CV», no anclas). */
export function isRouteActive(url: string, route: string): boolean {
  return pathOf(url) === route;
}

/** Comportamiento de scroll según la preferencia de movimiento reducido. */
export function scrollBehaviorFor(win: Pick<Window, 'matchMedia'> | null | undefined): ScrollBehavior {
  return prefersReducedMotion(win) ? 'auto' : 'smooth';
}
