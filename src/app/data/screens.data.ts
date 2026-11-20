/**
 * Encuadres y frases de las pantallas de /video y /voice. Va aparte de portfolio.data.ts (que importa la home y
 * pesa en el bundle inicial): esto solo lo cargan los chunks perezosos de esas dos páginas.
 */

/** Encuadre de un póster de Vimeo: `object-position` y zoom opcional (estático). Lo revisa una persona escena a escena. */
export interface PosterFraming {
  position: string;
  zoom?: number;
}

/** Encuadre por defecto: el centro, sin zoom. */
export const CENTERED: PosterFraming = { position: '50% 50%' };

/**
 * Carteles 2:3 de «En cartel», por videoId. Valores medidos sobre los pósters guardados (fallbackPoster);
 * hay que confirmarlos con los pósters vivos en un preview de Vercel.
 */
export const POSTER_FRAMING: Readonly<Record<string, PosterFraming>> = {
  '1208363473': { position: '60% 50%' }, // Reel 2026: cara a ~55 %; al 57 % asomaba la «P» del rótulo
  '1209481513': { position: '29% 50%' }, // Videobook Express: al 32 % asomaba el otro actor por la derecha
  '786041466': { position: '44% 50%' }, // Reel anterior: primer plano; vigilar que no asome la «P» del rótulo
  '989002249': { position: '31% 50%' }, // Pecadores de la pradera
};

/** Pantallas 16:9 de doblaje, por videoId: ocultan el subtítulo quemado y las bandas del póster. */
export const DUBBING_FRAMING: Readonly<Record<string, PosterFraming>> = {
  '715325007': { position: '40% 45%', zoom: 1.32 }, // póster 1:1 con bandas; subtítulo quemado en y≈71 %
  // póster 16:9 con banda arriba (≈13 %) y subtítulo quemado en y≈73–85 %: se ve la franja [14 %, 71 %].
  '994004071': { position: '41% 33%', zoom: 1.75 },
};

/** Frase doblada de cada demo, tal cual (decisión del PRD, 2026-11-14). */
export const DUBBING_LINES: Readonly<Record<string, string>> = {
  '715325007': 'John ha oído que Mantosh ha embarcado.',
  '994004071': 'Que me angustió mucho no haber recibido una invitación.',
};
