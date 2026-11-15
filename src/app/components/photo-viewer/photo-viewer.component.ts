import {
  ChangeDetectionStrategy, Component, ElementRef, OnDestroy, afterNextRender, computed, inject, input, model, output,
  viewChild,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { BookPhoto } from '../../data/photos.data';

/** Desplazamiento mínimo en px para que un deslizamiento cambie de foto. */
const SWIPE_MIN_PX = 40;

/**
 * Visor a pantalla completa de las fotos del book: la copia ampliada sobre papel claro (nunca sobre negro,
 * que recordaba a una esquela). Es un <dialog> nativo modal: Esc lo cierra y el resto de la página queda
 * inerte. Se navega con los botones, las flechas del teclado o deslizando en móvil, y da la vuelta al llegar
 * al final. El contenedor lo pinta solo mientras está abierto y lo quita al recibir `closed`.
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
  /** Se emite al cerrar (Esc, la X o pulsar fuera de la foto). */
  readonly closed = output<void>();

  readonly photo = computed(() => this.photos()[this.index()]);
  readonly counter = computed(() => `${this.index() + 1} / ${this.photos().length}`);
  readonly announcement = computed(() => `Foto ${this.index() + 1} de ${this.photos().length}: ${this.photo()?.alt ?? ''}`);

  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');
  private readonly document = inject(DOCUMENT);
  private previousOverflow = '';
  private swipeStartX: number | null = null;
  private finished = false;

  constructor() {
    afterNextRender(() => {
      const dialog = this.dialog().nativeElement;
      this.previousOverflow = this.document.body.style.overflow;
      this.document.body.style.overflow = 'hidden';
      // Sin showModal (navegadores muy antiguos) el diálogo se abre igualmente, aunque no sea modal.
      if (typeof dialog.showModal === 'function') {
        dialog.showModal();
      } else {
        dialog.setAttribute('open', '');
      }
    });
  }

  next(): void {
    this.index.update((i) => (i + 1) % this.photos().length);
  }

  previous(): void {
    this.index.update((i) => (i - 1 + this.photos().length) % this.photos().length);
  }

  close(): void {
    const dialog = this.dialog().nativeElement;
    if (dialog.open && typeof dialog.close === 'function') {
      dialog.close();
    }
    this.finish();
  }

  /** Evento `close` del diálogo: llega por Esc (y, en otra tarea, también tras close()). */
  onDialogClose(): void {
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
    this.document.body.style.overflow = this.previousOverflow;
  }
}
