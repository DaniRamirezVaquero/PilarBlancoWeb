import { PlaybackWindow, VIMEO_ORIGIN, parseVimeoMessage, watchVimeoPlayback } from './vimeo-player-events';

describe('parseVimeoMessage', () => {
  it('lee el evento de un string JSON o de un objeto', () => {
    expect(parseVimeoMessage('{"event":"play"}')).toEqual({ event: 'play' });
    expect(parseVimeoMessage({ event: 'pause' })).toEqual({ event: 'pause' });
  });

  it('devuelve null con lo que no es un mensaje con evento', () => {
    for (const data of ['no json', 42, null, undefined, {}, '{"method":"x"}', { event: 3 }, '"play"']) {
      expect(parseVimeoMessage(data)).withContext(String(data)).toBeNull();
    }
  });
});

describe('watchVimeoPlayback', () => {
  let listener: ((event: MessageEvent) => void) | null;
  let win: jasmine.SpyObj<PlaybackWindow>;
  let player: { postMessage: jasmine.Spy };
  let frame: HTMLIFrameElement;
  let onPlaying: jasmine.Spy;
  let stop: () => void;

  /** Mensaje como lo entrega el navegador: con origen y ventana de procedencia. */
  const send = (data: unknown, origin = VIMEO_ORIGIN, source: unknown = player) =>
    listener?.({ data, origin, source } as unknown as MessageEvent);

  beforeEach(() => {
    listener = null;
    win = jasmine.createSpyObj<PlaybackWindow>('win', ['addEventListener', 'removeEventListener']);
    win.addEventListener.and.callFake(((_type: string, fn: (event: MessageEvent) => void) => {
      listener = fn;
    }) as never);
    player = { postMessage: jasmine.createSpy('postMessage') };
    frame = { contentWindow: player } as unknown as HTMLIFrameElement;
    onPlaying = jasmine.createSpy('onPlaying');
    stop = watchVimeoPlayback(win, () => frame, onPlaying);
  });

  it('al recibir ready pide play, pause y ended al reproductor, solo a su origen', () => {
    // Act
    send('{"event":"ready"}');
    // Assert
    const calls = player.postMessage.calls.allArgs().filter(([m]) => JSON.parse(m as string).method === 'addEventListener');
    expect(calls.map(([message]) => JSON.parse(message as string).value)).toEqual(['play', 'pause', 'ended']);
    expect(calls.every(([message, origin]) =>
      JSON.parse(message as string).method === 'addEventListener' && origin === VIMEO_ORIGIN)).toBeTrue();
  });

  it('tras suscribirse pregunta getPaused y, si no está en pausa, cuenta como sonando', () => {
    // Act: ready, y después la respuesta (el autoplay ya había arrancado antes de suscribirse)
    send('{"event":"ready"}');
    const asked = player.postMessage.calls.allArgs().map(([m]) => JSON.parse(m as string).method);
    send('{"method":"getPaused","value":false}');
    // Assert
    expect(asked).toContain('getPaused');
    expect(onPlaying.calls.allArgs()).toEqual([[true]]);
  });

  it('si getPaused responde que está en pausa, no suena', () => {
    send({ method: 'getPaused', value: true });
    expect(onPlaying.calls.allArgs()).toEqual([[false]]);
  });

  it('avisa con true al sonar y con false al pausar o terminar', () => {
    send('{"event":"play"}');
    send({ event: 'pause' });
    send('{"event":"ended"}');
    expect(onPlaying.calls.allArgs()).toEqual([[true], [false], [false]]);
  });

  it('ignora mensajes de otro origen o de otro iframe', () => {
    send('{"event":"play"}', 'https://evil.example');
    send('{"event":"play"}', VIMEO_ORIGIN, {});
    send('{"event":"ready"}', VIMEO_ORIGIN, {});
    expect(onPlaying).not.toHaveBeenCalled();
    expect(player.postMessage).not.toHaveBeenCalled();
  });

  it('sin iframe no hace nada', () => {
    frame = null as unknown as HTMLIFrameElement;
    send('{"event":"play"}', VIMEO_ORIGIN, undefined);
    expect(onPlaying).not.toHaveBeenCalled();
  });

  it('la función devuelta quita la misma escucha', () => {
    stop();
    expect(win.removeEventListener).toHaveBeenCalledWith('message', win.addEventListener.calls.mostRecent().args[1]);
  });
});
