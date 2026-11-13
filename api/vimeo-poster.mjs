/**
 * GET /api/vimeo-poster?id=<videoId>&h=<hash>&w=<640|1280|1920>
 *
 * Redirige (302) a la carátula actual de un vídeo de Vimeo en el ancho pedido.
 * Host de oEmbed fijo, id y hash validados y destino limitado a i.vimeocdn.com:
 * no hay SSRF ni redirección abierta. No hace de proxy de los bytes.
 *
 * Es JavaScript ESM autocontenido (.mjs) a propósito: el package.json del
 * proyecto no declara "type": "module", y una función en TypeScript que
 * importe desde src/ se carga como CommonJS en Vercel y falla. La validación
 * replica la de src/app/utils/vimeo-thumbnail.ts (que usa el front y tiene
 * tests): si cambias una, cambia la otra.
 */

const POSTER_WIDTHS = [640, 1280, 1920];
const DEFAULT_WIDTH = 1280;
const THUMBNAIL_HOST = 'i.vimeocdn.com';
const VIDEO_ID = /^\d{6,12}$/;
const HASH = /^[0-9a-f]{6,20}$/i;
const SIZE_SUFFIX = /-d_\d+(x\d+)?$/;

/** La CDN y el navegador reutilizan la redirección; la CDN refresca cada hora y sirve la vieja mientras revalida. */
const CACHE_OK = 'public, max-age=300, s-maxage=3600, stale-while-revalidate=86400';
const CACHE_ERR = 'public, s-maxage=60';
const OEMBED_TIMEOUT_MS = 4000;

const toPosterWidth = (raw) => POSTER_WIDTHS.find((w) => String(w) === raw) ?? DEFAULT_WIDTH;

/** …-d_1280?region=us → …-d_<width>?region=us; null si no es una miniatura de i.vimeocdn.com. */
function resizeThumbnail(thumbnailUrl, width) {
  let url;
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

export async function GET(request) {
  const query = new URL(request.url).searchParams;
  const id = query.get('id');
  const hash = query.get('h');
  if (!id || !VIDEO_ID.test(id) || !hash || !HASH.test(hash)) {
    return new Response('Bad request', { status: 400, headers: { 'Cache-Control': CACHE_ERR } });
  }
  const width = toPosterWidth(query.get('w'));
  try {
    const oembed = `https://vimeo.com/api/oembed.json?url=${encodeURIComponent(`https://vimeo.com/${id}/${hash}`)}`;
    const res = await fetch(oembed, { signal: AbortSignal.timeout(OEMBED_TIMEOUT_MS) });
    if (!res.ok) {
      throw new Error(`oEmbed ${res.status}`);
    }
    const { thumbnail_url: thumbnail } = await res.json();
    const target = typeof thumbnail === 'string' ? resizeThumbnail(thumbnail, width) : null;
    if (!target) {
      throw new Error('thumbnail_url ausente o con formato inesperado');
    }
    return new Response(null, { status: 302, headers: { Location: target, 'Cache-Control': CACHE_OK } });
  } catch (error) {
    console.error('[vimeo-poster]', id, error);
    return new Response('Poster unavailable', { status: 502, headers: { 'Cache-Control': CACHE_ERR } });
  }
}
