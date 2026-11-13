import { isHash, isVideoId, resizeThumbnail, toPosterWidth } from '../src/app/utils/vimeo-thumbnail';

/** La CDN y el navegador reutilizan la redirección; la CDN refresca cada hora y sirve la vieja mientras revalida. */
const CACHE_OK = 'public, max-age=300, s-maxage=3600, stale-while-revalidate=86400';
const CACHE_ERR = 'public, s-maxage=60';
const OEMBED_TIMEOUT_MS = 4000;

/**
 * Redirige (302) a la carátula actual de un vídeo de Vimeo en el ancho pedido.
 * Host de oEmbed fijo, id y hash validados y destino limitado a i.vimeocdn.com:
 * no hay SSRF ni redirección abierta. No hace de proxy de los bytes.
 */
export async function GET(request: Request): Promise<Response> {
  const query = new URL(request.url).searchParams;
  const id = query.get('id');
  const hash = query.get('h');
  if (!isVideoId(id) || !isHash(hash)) {
    return new Response('Bad request', { status: 400, headers: { 'Cache-Control': CACHE_ERR } });
  }
  const width = toPosterWidth(query.get('w'));
  try {
    const oembed = `https://vimeo.com/api/oembed.json?url=${encodeURIComponent(`https://vimeo.com/${id}/${hash}`)}`;
    const res = await fetch(oembed, { signal: AbortSignal.timeout(OEMBED_TIMEOUT_MS) });
    if (!res.ok) {
      throw new Error(`oEmbed ${res.status}`);
    }
    const { thumbnail_url: thumbnail } = (await res.json()) as { thumbnail_url?: string };
    const target = thumbnail ? resizeThumbnail(thumbnail, width) : null;
    if (!target) {
      throw new Error('thumbnail_url ausente o con formato inesperado');
    }
    return new Response(null, { status: 302, headers: { Location: target, 'Cache-Control': CACHE_OK } });
  } catch (error) {
    console.error('[vimeo-poster]', id, error);
    return new Response('Poster unavailable', { status: 502, headers: { 'Cache-Control': CACHE_ERR } });
  }
}
