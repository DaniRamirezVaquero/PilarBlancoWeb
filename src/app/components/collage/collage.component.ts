import { Component } from '@angular/core';

interface CollagePhoto {
  src: string;
  alt: string;
  /** Texto que se ve siempre bajo la foto (no depende del hover). */
  caption: string;
  width: number;
  height: number;
}

/** Todas las fotos se sirven a 900 px de ancho (versiones «-900» de los originales); la altura es la real de cada una. */
const PHOTO_WIDTH = 900;

/** Altura real (px) y proyecto de cada foto de /assets/images/collage, en orden. */
const PHOTOS: readonly { n: number; height: number; title: string }[] = [
  { n: 1, height: 475, title: 'VIOLENCIAS PERIFÉRICAS' },
  { n: 2, height: 561, title: 'EL DON' },
  { n: 3, height: 622, title: 'PECADORES DE LA PRADERA' },
  { n: 4, height: 382, title: 'MEDAC' },
  { n: 5, height: 432, title: 'PEDIOFOBIA' },
  { n: 6, height: 591, title: 'AQUELLA FOTOGRAFÍA' },
  { n: 7, height: 504, title: 'LUMON' },
  { n: 8, height: 600, title: 'MÁS ALLÁ DE LO COMÚN' },
  { n: 9, height: 390, title: 'DISONANCIAS' },
  { n: 10, height: 506, title: 'LO QUE ESCONDE EL TARÓ' },
  { n: 11, height: 428, title: 'APOGEO' },
  { n: 12, height: 410, title: 'POR LAS NUBES_FERNANDO COLOMO' },
  { n: 13, height: 375, title: 'PETIT À PETIT' },
  { n: 14, height: 375, title: 'REY GITANO' },
  { n: 15, height: 485, title: 'GLORIA Y CANDELA' },
  { n: 16, height: 382, title: 'UNA LAMENTABLE PÉRDIDA' },
  { n: 17, height: 506, title: 'NO SOY TU MADRE' },
  { n: 18, height: 506, title: 'LIBRES AL FIN' },
  { n: 19, height: 420, title: 'CRONOS' },
  { n: 20, height: 409, title: 'BLURRY EYES' },
  { n: 21, height: 380, title: 'CIEL SANS LUNE' },
  { n: 22, height: 506, title: 'EL ANFITRIÓN' },
  { n: 23, height: 402, title: 'CALIBRE 55' },
  { n: 24, height: 403, title: 'CALIBRE 55' },
  { n: 25, height: 506, title: 'QUANTUM' },
  { n: 26, height: 432, title: 'CROMA 11' },
  { n: 27, height: 600, title: 'ABRO LOS OJOS SUEÑO CONTIGO' },
  { n: 28, height: 404, title: 'PABLO ESCOLAR' },
  { n: 29, height: 473, title: 'SIN NOTICIAS DE GURB' },
  { n: 30, height: 506, title: 'SERIE RABIA' },
  { n: 31, height: 471, title: 'ALICE' },
  { n: 32, height: 553, title: 'ESPACIO ALZHEIMER ANDALUCÍA' },
  { n: 33, height: 506, title: 'ESPACIO ALZHEIMER ANDALUCÍA' },
  { n: 34, height: 563, title: 'ESPACIO ALZHEIMER ANDALUCÍA' },
  { n: 35, height: 570, title: 'DARKINSIDE' },
];

/** «POR LAS NUBES_FERNANDO COLOMO» se muestra como «Por las nubes · Fernando Colomo». */
export function captionOf(title: string): string {
  return title.replace(/_/g, ' · ');
}

@Component({
  selector: 'app-collage',
  templateUrl: './collage.component.html',
  styleUrl: './collage.component.css',
})
export class CollageComponent {
  /** Lista plana: el reparto en columnas lo hace CSS (columns), que equilibra las alturas en cada breakpoint. */
  readonly photos: readonly CollagePhoto[] = PHOTOS.map((p): CollagePhoto => {
    const caption = captionOf(p.title);
    return {
      src: `assets/images/collage/FOTO (${p.n})-900.webp`,
      alt: `Pilar Blanco, actriz, en el proyecto ${caption}`,
      caption,
      width: PHOTO_WIDTH,
      height: p.height,
    };
  });
}
