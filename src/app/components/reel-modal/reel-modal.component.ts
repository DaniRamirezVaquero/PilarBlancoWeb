import {
  ChangeDetectionStrategy, Component, DestroyRef, ElementRef, NgZone, afterNextRender, inject, output, viewChild,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { REEL } from '../../data/portfolio.data';

/** Lo que puede recibir el foco dentro del diálogo: la X y el reproductor. */
const FOCUSABLE = 'button:not([disabled]), iframe';

/**
 * Reel a pantalla completa del botón ▶ del hero. Vive fuera del bundle inicial: la home lo carga con
 * `@defer` al abrirlo (y lo precarga en reposo). Mientras está abierto bloquea el scroll en `html`,
 * Esc lo cierra, el foco empieza en la X y Tab no sale del diálogo; quien lo abre devuelve el foco al cerrarlo.
 */
@Component({
  selector: 'app-reel-modal',
  standalone: true,
  templateUrl: './reel-modal.component.html',
  styleUrl: './reel-modal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReelModalComponent {
  /** Pide cerrar el modal (la X o Esc). */
  readonly closed = output<void>();

  readonly title = REEL.title;
  readonly src: SafeResourceUrl = inject(DomSanitizer).bypassSecurityTrustResourceUrl(
    `https://player.vimeo.com/video/${REEL.videoId}?h=${REEL.hash}`,
  );

  private readonly dialog = viewChild.required<ElementRef<HTMLElement>>('dialog');
  private readonly closeBtn = viewChild.required<ElementRef<HTMLButtonElement>>('close');
  private readonly document = inject(DOCUMENT);
  private readonly zone = inject(NgZone);

  private readonly onKeydown = (event: KeyboardEvent): void => {
    if (event.key === 'Escape') {
      this.zone.run(() => this.closed.emit());
    } else if (event.key === 'Tab') {
      this.trapTab(event);
    }
  };

  /** Si el foco acaba fuera del diálogo (p. ej. al salir del iframe con Tab), vuelve a la X. */
  private readonly onFocusIn = (event: FocusEvent): void => {
    if (!this.dialog().nativeElement.contains(event.target as Node)) {
      this.closeBtn().nativeElement.focus();
    }
  };

  /** Tab en el último elemento vuelve al primero y Mayús+Tab en el primero va al último. */
  private trapTab(event: KeyboardEvent): void {
    const items = Array.from(this.dialog().nativeElement.querySelectorAll<HTMLElement>(FOCUSABLE));
    if (items.length === 0) {
      return;
    }
    const first = items[0];
    const last = items[items.length - 1];
    const current = this.document.activeElement;
    const outside = !this.dialog().nativeElement.contains(current);
    if (event.shiftKey && (current === first || outside)) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && (current === last || outside)) {
      event.preventDefault();
      first.focus();
    }
  }

  constructor() {
    // Solo en el navegador: en el prerender el modal nunca está abierto.
    afterNextRender(() => {
      this.document.documentElement.style.overflow = 'hidden';
      this.document.addEventListener('keydown', this.onKeydown);
      this.document.addEventListener('focusin', this.onFocusIn);
      this.closeBtn().nativeElement.focus();
    });
    inject(DestroyRef).onDestroy(() => {
      this.document.removeEventListener('keydown', this.onKeydown);
      this.document.removeEventListener('focusin', this.onFocusIn);
      this.document.documentElement.style.overflow = '';
    });
  }
}
