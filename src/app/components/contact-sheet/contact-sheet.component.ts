import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { BOOK_PHOTOS } from '../../data/photos.data';
import { PhotoViewerComponent } from '../photo-viewer/photo-viewer.component';

/**
 * Hoja de contactos del book: las 12 fotos del carrusel, en su orden, impresas sobre papel fotográfico
 * claro, con marcas de recorte en las esquinas y el borde de la película numerado fila a fila. Pulsar un
 * fotograma lo abre a pantalla completa en `app-photo-viewer`, desde donde se recorre todo el book.
 */
@Component({
  selector: 'app-contact-sheet',
  standalone: true,
  imports: [PhotoViewerComponent],
  templateUrl: './contact-sheet.component.html',
  styleUrl: './contact-sheet.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactSheetComponent {
  readonly photos = BOOK_PHOTOS;

  /** Fotograma con el que se abrió el visor; null con el visor cerrado. */
  readonly openIndex = signal<number | null>(null);
  /** Foto que muestra el visor: empieza en la pulsada y cambia al navegar. */
  readonly viewerIndex = signal(0);

  private opener: HTMLElement | null = null;

  /** Número de fotograma como en el borde de la película: 1, 2… */
  frameNumber(index: number): string {
    return String(index + 1);
  }

  open(index: number, event: Event): void {
    this.opener = event.currentTarget as HTMLElement | null;
    this.viewerIndex.set(index);
    this.openIndex.set(index);
  }

  /** Al cerrar, el foco vuelve al fotograma de la foto que se estaba viendo (o al que abrió el visor). */
  onViewerClosed(): void {
    const shown = this.viewerIndex();
    this.openIndex.set(null);
    const frames = this.opener?.closest('ol')?.querySelectorAll<HTMLButtonElement>('.frame-open');
    const target = frames?.[shown] ?? this.opener;
    target?.focus({ preventScroll: false });
    this.opener = null;
  }
}
