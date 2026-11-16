import { prefersReducedMotion } from './motion';

/** Ventana mínima que necesita revealOnce: se inyecta para poder probarla sin navegador real. */
export type RevealWindow = Pick<Window, 'innerHeight' | 'location' | 'matchMedia' | 'document'> & {
  IntersectionObserver?: typeof IntersectionObserver;
};

/** Qué disparó la entrada: verse, recibir el foco o activarse el movimiento reducido. */
export type RevealReason = 'visible' | 'focus' | 'reduced-motion';

export interface RevealOnceOptions {
  /** Si al armar el elemento empieza por debajo de esta fracción del alto de la ventana, se arma. */
  armRatio?: number;
  /** Fracción visible del elemento que dispara la entrada. */
  showRatio?: number;
  /**
   * Ids de las secciones a las que se enlaza. Solo un hash que sea uno de ellos (y exista) desarma la entrada;
   * cualquier otro (`#sobre-title`, un ancla interna) no. Sin esta lista, vale cualquier id existente.
   */
  deepLinkIds?: readonly string[];
}

export interface RevealHandle {
  /** true si se armó: el componente pone `is-armed` y espera a `onReveal`. */
  readonly armed: boolean;
  /** Desconecta el observador y las escuchas sin llamar a onReveal (llamar al destruir el componente). */
  destroy(): void;
}

export const REVEAL_ARM_RATIO = 0.45;
export const REVEAL_SHOW_RATIO = 0.2;

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';
const NOT_ARMED: RevealHandle = { armed: false, destroy: () => undefined };

/** true si la URL apunta a un elemento de la página (enlace directo a una sección). */
function hasDeepLink(win: RevealWindow, ids?: readonly string[]): boolean {
  const hash = win.location.hash.slice(1);
  if (hash === '' || (ids && !ids.includes(hash))) {
    return false;
  }
  return win.document.getElementById(hash) !== null;
}

/**
 * Entrada de una sola vez. No arma (y no llama a onReveal) sin IntersectionObserver, con movimiento
 * reducido, con un hash que apunta a un elemento de la página (si se pasa `deepLinkIds`, solo a una de esas secciones) o si el
 * elemento ya está a la vista. Si arma, onReveal se llama una vez: al verse showRatio del elemento,
 * al recibir el foco algo de dentro o al activarse el movimiento reducido.
 */
export function revealOnce(
  el: HTMLElement,
  win: RevealWindow | null | undefined,
  onReveal: (reason: RevealReason) => void,
  options: RevealOnceOptions = {},
): RevealHandle {
  const IO = win?.IntersectionObserver;
  if (!win || !IO) {
    return NOT_ARMED;
  }
  const armRatio = options.armRatio ?? REVEAL_ARM_RATIO;
  const showRatio = options.showRatio ?? REVEAL_SHOW_RATIO;
  const belowView = el.getBoundingClientRect().top > win.innerHeight * armRatio;
  if (prefersReducedMotion(win) || hasDeepLink(win, options.deepLinkIds) || !belowView) {
    return NOT_ARMED;
  }

  let done = false;
  const motion = win.matchMedia?.(REDUCED_MOTION_QUERY) ?? null;
  const reveal = (reason: RevealReason): void => {
    if (done) {
      return;
    }
    done = true;
    cleanup();
    onReveal(reason);
  };
  const onFocus = (): void => reveal('focus');
  const onMotion = (event: MediaQueryListEvent): void => {
    if (event.matches) {
      reveal('reduced-motion');
    }
  };
  const observer = new IO(([entry]) => {
    if (entry?.isIntersecting) {
      reveal('visible');
    }
  }, { threshold: showRatio });
  const cleanup = (): void => {
    observer.disconnect();
    el.removeEventListener('focusin', onFocus);
    motion?.removeEventListener?.('change', onMotion);
  };

  observer.observe(el);
  el.addEventListener('focusin', onFocus);
  motion?.addEventListener?.('change', onMotion);
  return {
    armed: true,
    destroy: () => {
      done = true;
      cleanup();
    },
  };
}
