import { InjectionToken } from '@angular/core';

/**
 * Interruptor de la firma vectorial: aprobada (2026-11-16), la home la escribe trazo a trazo. Con `false`
 * se volvería a la imagen estática (assets/firma-pilar.webp, recortada del lockup del CV), y ?firma=trazo
 * la enseñaría en el preview.
 */
export const SIGNATURE_VECTOR_APPROVED = true;

export const SIGNATURE_APPROVED = new InjectionToken<boolean>('Firma vectorial aprobada', {
  providedIn: 'root',
  factory: () => SIGNATURE_VECTOR_APPROVED,
});

/** Parámetro de la URL que fuerza la versión vectorial en el navegador (solo para validarla). */
export const SIGNATURE_PREVIEW_PARAM = 'firma';
export const SIGNATURE_PREVIEW_VALUE = 'trazo';

/**
 * Caja de la firma completa, «Pilar» y «BLANCO», en coordenadas del lockup del CV (868×300). Es la misma
 * para el vector y el respaldo, así que pasar de uno a otro no mueve nada.
 */
export const SIGNATURE_BOX = { x: 96, y: 14, w: 680, h: 270 } as const;

/** Caja de «Pilar» (la del recorte assets/firma-pilar.webp), dentro de SIGNATURE_BOX. */
export const SIGNATURE_PILAR_BOX = { x: 96, y: 14, w: 528, h: 160 } as const;

/**
 * «BLANCO» del lockup: Lato Light en mayúsculas espaciadas, bajo «Pilar» y alineado con su final. Medido
 * por píxeles contra el lockup: cada letra cae a 0–7 px de la original. textLength fija el tracking.
 */
export const SIGNATURE_SURNAME = { text: 'BLANCO', x: 412, y: 274, fontSize: 76.4, textLength: 360 } as const;

/** Grosor del trazo de la firma original, medido en el lockup (px del lockup). */
export const SIGNATURE_STROKE_WIDTH = 8;

