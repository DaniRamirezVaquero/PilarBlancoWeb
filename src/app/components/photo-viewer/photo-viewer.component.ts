import {
  ChangeDetectionStrategy, Component, ElementRef, OnDestroy, afterNextRender, computed, inject, input, model, output,
  viewChild,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { BookPhoto } from '../../data/photos.data';
import { prefersReducedMotion } from '../../utils/motion';

/** Desplazamiento mínimo en px para que un deslizamiento cambie de foto. */
const SWIPE_MIN_PX = 40;
/** Vuelo de la foto entre su fotograma y la pantalla completa. */
const FLY_OPEN_MS = 460;
const FLY_CLOSE_MS = 360;
const FLY_EASING = 'cubic-bezier(0.22, 1, 0.36, 1)';
/** Si la foto grande tarda más que esto en decodificar, entra con un fundido en vez de volar. */
const DECODE_WAIT_MS = 250;
/** Entrada de la foto al cambiar con las flechas: desliza desde el lado por el que llega. */
const SLIDE_MS = 280;
const SLIDE_PX = 28;

/** Fotograma de la hoja de contactos de la foto `index`, en coordenadas de la ventana (null si no hay). */
export type PhotoOrigin = (index: number) => DOMRect | null;

/**
 * Visor a pantalla completa de las fotos del book: la copia ampliada sobre papel claro (nunca sobre negro,
 * que recordaba a una esquela). Es un <dialog> nativo modal: Esc lo cierra y el resto de la página queda
 * inerte. Se navega con los botones, las flechas del teclado o deslizando en móvil, y da la vuelta al llegar
 * al final. El contenedor lo pinta solo mientras está abierto y lo quita al recibir `closed`.
 *
 * Con `originOf`, la foto vuela desde su fotograma al abrir y vuelve a él al cerrar (solo `transform` y
 * `clip-path`, que pasa del recorte vertical del fotograma a la foto entera). Con movimiento reducido, o si
 * el fotograma no se ve, no hay vuelo.
 */
@Component({
  selector: 'app-photo-viewer',
  standalone: true,
  templateUrl: './photo-viewer.component.html',
  styleUrl: './photo-viewer.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhotoViewerComponent implements OnDestroy {
  readonly photos = input.required<readonly BookPhoto[]>();
  /** Foto que se muestra; el visor la cambia al navegar. */
  readonly index = model.required<number>();
  /** Dónde está el fotograma de cada foto en la página, para el vuelo de apertura y cierre. */
  readonly originOf = input<PhotoOrigin | null>(null);
  /** Se emite al cerrar (Esc, la X o pulsar fuera de la foto). */
  readonly closed = output<void>();

  readonly photo = computed(() => this.photos()[this.index()]);
  readonly counter = computed(() => `${this.index() + 1} / ${this.photos().length}`);
  readonly announcement = computed(() => `Foto ${this.index() + 1} de ${this.photos().length}: ${this.photo()?.alt ?? ''}`);

  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');
  private readonly image = viewChild<ElementRef<HTMLImageElement>>('image');
  private readonly document = inject(DOCUMENT);
  private previousOverflow = '';
  private swipeStartX: number | null = null;
  private finished = false;
  private closing = false;

  constructor() {
    afterNextRender(() => {
      const dialog = this.dialog().nativeElement;
      this.previousOverflow = this.document.documentElement.style.overflow;
      this.document.documentElement.style.overflow = 'hidden';
      // Sin showModal (navegadores muy antiguos) el diálogo se abre igualmente, aunque no sea modal.
      if (typeof dialog.showModal === 'function') {
        dialog.showModal();
      } else {
        dialog.setAttribute('open', '');
      }
      void this.flyIn();
    });
  }

  next(): void {
    this.index.update((i) => (i + 1) % this.photos().length);
    this.slideIn(1);
  }

  previous(): void {
    this.index.update((i) => (i - 1 + this.photos().length) % this.photos().length);
    this.slideIn(-1);
  }

  /** Cierra con el vuelo de vuelta al fotograma si se puede; si no, al momento. */
  close(): void {
    if (this.closing || this.finished) {
      return;
    }
    const img = this.image()?.nativeElement;
    const origin = this.visibleOrigin();
    if (!img || !origin || !this.canAnimate(img)) {
      this.closeNow();
      return;
    }
    this.closing = true;
    this.dialog().nativeElement.classList.add('is-closing');
    const to = flightFrom(origin, img.getBoundingClientRect());
    const flight = img.animate([{ transform: 'none', clipPath: 'inset(0px)' }, to], {
      duration: FLY_CLOSE_MS, easing: FLY_EASING, fill: 'forwards',
    });
    flight.finished.catch(() => undefined).then(() => this.closeNow());
  }

  /** Esc: el diálogo se cerraría de golpe; se cancela para cerrar con la animación. */
  onCancel(event: Event): void {
    event.preventDefault();
    this.close();
  }

  /** Evento `close` del diálogo: llega tras closeNow() o si el navegador cierra sin pasar por cancel. */
  onDialogClose(): void {
    this.finish();
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      this.next();
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      this.previous();
    }
  }

  /** Pulsar en el papel, fuera de la foto y de los controles, cierra el visor. */
  onStageClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.close();
    }
  }

  onPointerDown(event: PointerEvent): void {
    this.swipeStartX = event.isPrimary ? event.clientX : null;
  }

  onPointerCancel(): void {
    this.swipeStartX = null;
  }

  onPointerUp(event: PointerEvent): void {
    if (this.swipeStartX === null) {
      return;
    }
    const dx = event.clientX - this.swipeStartX;
    this.swipeStartX = null;
    if (Math.abs(dx) < SWIPE_MIN_PX) {
      return;
    }
    if (dx < 0) {
      this.next();
    } else {
      this.previous();
    }
  }

  ngOnDestroy(): void {
    this.document.documentElement.style.overflow = this.previousOverflow;
  }

  /** Apertura: la foto sale de su fotograma. Mientras decodifica se oculta para no verla antes en su sitio. */
  private async flyIn(): Promise<void> {
    const img = this.image()?.nativeElement;
    const origin = this.visibleOrigin();
    if (!img || !origin || !this.canAnimate(img)) {
      return;
    }
    img.style.opacity = '0';
    const decoded = await Promise.race([
      img.decode().then(() => true, () => false),
      new Promise<boolean>((resolve) => setTimeout(() => resolve(false), DECODE_WAIT_MS)),
    ]);
    img.style.opacity = '';
    if (this.closing || this.finished) {
      return;
    }
    if (!decoded) {
      // Sin la foto lista no se conoce su tamaño final: entra con un fundido.
      img.animate([{ opacity: 0 }, { opacity: 1 }], { duration: SLIDE_MS, easing: 'ease-out' });
      return;
    }
    const from = flightFrom(origin, img.getBoundingClientRect());
    img.animate([from, { transform: 'none', clipPath: 'inset(0px)' }], { duration: FLY_OPEN_MS, easing: FLY_EASING });
  }

  /** Al cambiar de foto, la nueva entra desde el lado por el que llega. */
  private slideIn(direction: 1 | -1): void {
    const img = this.image()?.nativeElement;
    if (!img || !this.canAnimate(img)) {
      return;
    }
    img.animate(
      [{ opacity: 0, transform: `translateX(${direction * SLIDE_PX}px)` }, { opacity: 1, transform: 'none' }],
      { duration: SLIDE_MS, easing: FLY_EASING },
    );
  }

  /** El fotograma de la foto actual, solo si está dentro de la ventana (si no, el vuelo no se vería). */
  private visibleOrigin(): DOMRect | null {
    const rect = this.originOf()?.(this.index()) ?? null;
    const viewportH = this.document.defaultView?.innerHeight ?? 0;
    if (!rect || rect.width <= 0 || rect.bottom <= 0 || rect.top >= viewportH) {
      return null;
    }
    return rect;
  }

  private canAnimate(img: HTMLImageElement): boolean {
    return typeof img.animate === 'function' && !prefersReducedMotion(this.document.defaultView);
  }

  private closeNow(): void {
    const dialog = this.dialog().nativeElement;
    if (dialog.open && typeof dialog.close === 'function') {
      dialog.close();
    }
    this.finish();
  }

  /** Emite `closed` una sola vez, venga del botón, del papel o de Esc. */
  private finish(): void {
    if (this.finished) {
      return;
    }
    this.finished = true;
    this.closed.emit();
  }
}

/**
 * Fotograma clave que coloca la foto grande (`target`) encima de su fotograma (`origin`): escala uniforme
 * (sin deformar) y un recorte que deja visible solo la parte que enseña el fotograma, que es más vertical.
 */
export function flightFrom(origin: DOMRect, target: DOMRect): Keyframe {
  let scale = origin.width / target.width;
  let insetX = 0;
  let insetY = 0;
  const visibleH = origin.height / scale;
  if (visibleH <= target.height) {
    insetY = (target.height - visibleH) / 2;
  } else {
    scale = origin.height / target.height;
    insetX = Math.max(0, (target.width - origin.width / scale) / 2);
  }
  const dx = origin.left + origin.width / 2 - (target.left + target.width / 2);
  const dy = origin.top + origin.height / 2 - (target.top + target.height / 2);
  return {
    transform: `translate(${dx}px, ${dy}px) scale(${scale})`,
    clipPath: `inset(${insetY}px ${insetX}px)`,
  };
}
