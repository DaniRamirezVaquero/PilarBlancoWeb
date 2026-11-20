/** Origen del reproductor: solo se aceptan mensajes de aquí y solo se le escribe a él. */
export const VIMEO_ORIGIN = 'https://player.vimeo.com';

/** Eventos del reproductor que se piden al recibir `ready`. */
const WATCHED = ['play', 'pause', 'ended'] as const;

/** Lee la respuesta a un método (`{method, value}`). Devuelve null si no es una respuesta. */
export function parseVimeoReply(data: unknown): { method: string; value: unknown } | null {
  let value: unknown = data;
  if (typeof data === 'string') {
    try {
      value = JSON.parse(data);
    } catch {
      return null;
    }
  }
  if (typeof value !== 'object' || value === null) {
    return null;
  }
  const { method, value: reply } = value as { method?: unknown; value?: unknown };
  return typeof method === 'string' ? { method, value: reply } : null;
}

/** Ventana mínima que necesita la escucha: se inyecta para poder probarla sin navegador real. */
export type PlaybackWindow = Pick<Window, 'addEventListener' | 'removeEventListener'>;

/** Lee un mensaje del reproductor (string JSON u objeto). Devuelve null si no trae `event`. */
export function parseVimeoMessage(data: unknown): { event: string } | null {
  let value: unknown = data;
  if (typeof data === 'string') {
    try {
      value = JSON.parse(data);
    } catch {
      // No es un mensaje del protocolo de Vimeo: se ignora.
      return null;
    }
  }
  if (typeof value !== 'object' || value === null) {
    return null;
  }
  const event = (value as { event?: unknown }).event;
  return typeof event === 'string' ? { event } : null;
}

/** Pide al reproductor que arranque (el mismo protocolo, sin SDK). */
export function postVimeoPlay(frame: HTMLIFrameElement | null | undefined): void {
  frame?.contentWindow?.postMessage(JSON.stringify({ method: 'play' }), VIMEO_ORIGIN);
}

/**
 * Escucha play/pause/ended del iframe que devuelva `frame()`, con el protocolo de postMessage del reproductor
 * de Vimeo (sin su SDK). Al recibir `ready` le pide esos eventos. Avisa con true al sonar y con false al pausar
 * o terminar. Solo atiende mensajes de `VIMEO_ORIGIN` que vengan de ese iframe: otro reproductor no cuenta.
 * La escucha se instala antes de que exista el iframe, porque `ready` llega nada más cargarlo.
 * Devuelve la función que deja de escuchar.
 */
export function watchVimeoPlayback(
  win: PlaybackWindow,
  frame: () => HTMLIFrameElement | null | undefined,
  onPlaying: (playing: boolean) => void,
): () => void {
  const onMessage = (event: MessageEvent): void => {
    const player = frame()?.contentWindow;
    if (event.origin !== VIMEO_ORIGIN || !player || event.source !== player) {
      return;
    }
    const reply = parseVimeoReply(event.data);
    if (reply?.method === 'getPaused' && typeof reply.value === 'boolean') {
      onPlaying(!reply.value);
      return;
    }
    const message = parseVimeoMessage(event.data);
    switch (message?.event) {
      case 'ready':
        for (const value of WATCHED) {
          player.postMessage(JSON.stringify({ method: 'addEventListener', value }), VIMEO_ORIGIN);
        }
        // Si `play` llegó antes de suscribirse (autoplay), no habrá evento: se pregunta el estado actual.
        player.postMessage(JSON.stringify({ method: 'getPaused' }), VIMEO_ORIGIN);
        break;
      case 'play':
        onPlaying(true);
        break;
      case 'pause':
      case 'ended':
        onPlaying(false);
        break;
    }
  };
  win.addEventListener('message', onMessage as EventListener);
  return () => win.removeEventListener('message', onMessage as EventListener);
}
