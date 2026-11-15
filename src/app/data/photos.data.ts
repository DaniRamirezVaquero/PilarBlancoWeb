/** Foto del book: src de 900w y srcset 900w/1400w en assets/images/carousel. */
export interface BookPhoto {
  src: string;
  srcset: string;
  alt: string;
}

/** Construye el src y el srcset responsivo (900w/1400w) de una foto del book. */
export function bookPhoto(name: string, alt: string): BookPhoto {
  const base = `assets/images/carousel/${name}`;
  return {
    src: `${base}-900.webp`,
    srcset: `${base}-900.webp 900w, ${base}-1400.webp 1400w`,
    alt,
  };
}

/** Book fotográfico en el orden del carrusel; lo comparten el carrusel (/gallery) y la hoja de contactos (home). */
export const BOOK_PHOTOS: readonly BookPhoto[] = [
  bookPhoto('Pilar Blanco WEB_1', 'Pilar Blanco, actriz, de pie con camiseta negra en book fotográfico'),
  bookPhoto('Pilar Blanco WEB_2', 'Pilar Blanco, actriz, en retrato de book fotográfico'),
  bookPhoto('Pilar Blanco WEB_3', 'Pilar Blanco, actriz, posando en sesión de book'),
  bookPhoto('Pilar Blanco WEB_4', 'Pilar Blanco, actriz, sentada en un taburete con ropa negra'),
  bookPhoto('Pilar Blanco WEB_5', 'Pilar Blanco, actriz, en retrato artístico de galería'),
  bookPhoto('Pilar Blanco WEB_6', 'Pilar Blanco, actriz, de pie con camisa blanca y vaqueros'),
  bookPhoto('Pilar Blanco WEB_7', 'Pilar Blanco, actriz, en fotografía de book promocional'),
  bookPhoto('Pilar Blanco WEB_8', 'Pilar Blanco, actriz, en retrato de carácter'),
  bookPhoto('Pilar Blanco WEB_9', 'Pilar Blanco, actriz, en sesión fotográfica de galería'),
  bookPhoto('Pilar Blanco WEB_10', 'Pilar Blanco, actriz, en retrato de book en color'),
  bookPhoto('Pilar Blanco WEB_11', 'Pilar Blanco, actriz, en fotografía de galería web'),
  bookPhoto('Pilar Blanco WEB_12', 'Pilar Blanco, actriz, sentada en un baúl en book fotográfico'),
];
