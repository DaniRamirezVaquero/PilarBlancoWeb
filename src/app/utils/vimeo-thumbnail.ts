/**
 * Lógica pura de las carátulas de Vimeo. La comparten el front (facade) y la
 * función de Vercel `api/vimeo-poster.ts`, así que no depende de Angular.
 */

export const POSTER_WIDTHS = [640, 1280, 1920] as const;
export type PosterWidth = (typeof POSTER_WIDTHS)[number];

export const POSTER_ENDPOINT = '/api/vimeo-poster';
const DEFAULT_WIDTH: PosterWidth = 1280;
const THUMBNAIL_HOST = 'i.vimeocdn.com';

const VIDEO_ID = /^\d{6,12}$/;
const HASH = /^[0-9a-f]{6,20}$/i;
const SIZE_SUFFIX = /-d_\d+(x\d+)?$/;

export const isVideoId = (value: string | null): value is string => !!value && VIDEO_ID.test(value);

export const isHash = (value: string | null): value is string => !!value && HASH.test(value);

export const toPosterWidth = (raw: string | null): PosterWidth =>
  POSTER_WIDTHS.find((w) => String(w) === raw) ?? DEFAULT_WIDTH;

/** URL relativa del póster vivo (la sirve api/vimeo-poster.ts). */
export function posterUrl(id: string, hash: string, width: PosterWidth): string {
  return `${POSTER_ENDPOINT}?id=${id}&h=${hash}&w=${width}`;
}

export function posterSrcset(id: string, hash: string): string {
  return POSTER_WIDTHS.map((w) => `${posterUrl(id, hash, w)} ${w}w`).join(', ');
}

/**
 * Reescribe el sufijo de tamaño de una miniatura de i.vimeocdn.com
 * (…-d_1280?region=us → …-d_1920?region=us). Devuelve null si el host no es
 * el de la CDN de Vimeo o la ruta no trae el sufijo esperado: así la función
 * nunca redirige a un destino que no sea suyo.
 */
export function resizeThumbnail(thumbnailUrl: string, width: PosterWidth): string | null {
  let url: URL;
  try {
    url = new URL(thumbnailUrl);
  } catch {
    return null;
  }
  if (url.protocol !== 'https:' || url.hostname !== THUMBNAIL_HOST || !SIZE_SUFFIX.test(url.pathname)) {
    return null;
  }
  url.pathname = url.pathname.replace(SIZE_SUFFIX, `-d_${width}`);
  return url.toString();
}
