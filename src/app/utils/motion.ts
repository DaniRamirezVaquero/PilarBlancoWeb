/** true si el usuario pidió movimiento reducido (sin `window`, p. ej. en el prerender, devuelve false). */
export function prefersReducedMotion(win: Pick<Window, 'matchMedia'> | null | undefined): boolean {
  return win?.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
}
