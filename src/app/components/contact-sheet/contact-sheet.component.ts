import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BOOK_PHOTOS } from '../../data/photos.data';

/**
 * Hoja de contactos del book: las 12 fotos del carrusel, en su orden, impresas sobre papel fotográfico
 * claro, con marcas de recorte en las esquinas y el borde de la película numerado fila a fila. Es estática
 * y no tiene nada que pulsar: solo se mira.
 */
@Component({
  selector: 'app-contact-sheet',
  standalone: true,
  templateUrl: './contact-sheet.component.html',
  styleUrl: './contact-sheet.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactSheetComponent {
  readonly photos = BOOK_PHOTOS;

  /** Número de fotograma como en el borde de la película: 1, 2… */
  frameNumber(index: number): string {
    return String(index + 1);
  }
}
