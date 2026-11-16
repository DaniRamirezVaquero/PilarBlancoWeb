import { RevealReason, RevealWindow, revealOnce } from './reveal-once';

/** IntersectionObserver de mentira: guarda cada instancia para disparar sus entradas a mano. */
class FakeIO {
  static instances: FakeIO[] = [];
  readonly targets: Element[] = [];
  disconnected = false;
  constructor(private readonly callback: IntersectionObserverCallback, readonly options: IntersectionObserverInit = {}) {
    FakeIO.instances.push(this);
  }
  observe(target: Element): void { this.targets.push(target); }
  unobserve(): void { /* sin uso */ }
  disconnect(): void { this.disconnected = true; this.targets.length = 0; }
  takeRecords(): IntersectionObserverEntry[] { return []; }
  fire(isIntersecting: boolean): void {
    const entry = { target: this.targets[0], isIntersecting } as IntersectionObserverEntry;
    this.callback([entry], this as unknown as IntersectionObserver);
  }
}

describe('revealOnce', () => {
  const INNER_HEIGHT = 800;
  let el: HTMLElement;
  let child: HTMLButtonElement;
  let reasons: RevealReason[];
  let motionListeners: ((event: MediaQueryListEvent) => void)[];
  let topRatio: number;

  /** Ventana falsa: el elemento empieza a `topRatio` del alto de la ventana. */
  const fakeWindow = (opts: { topRatio?: number; reduced?: boolean; hash?: string; io?: boolean } = {}): RevealWindow => {
    topRatio = opts.topRatio ?? 1.5;
    return {
      innerHeight: INNER_HEIGHT,
      location: { hash: opts.hash ?? '' } as Location,
      document,
      matchMedia: ((query: string) => ({
        matches: !!opts.reduced && query.includes('prefers-reduced-motion'),
        addEventListener: (_t: string, listener: (event: MediaQueryListEvent) => void) => motionListeners.push(listener),
        removeEventListener: (_t: string, listener: (event: MediaQueryListEvent) => void) => {
          motionListeners = motionListeners.filter((l) => l !== listener);
        },
      })) as unknown as Window['matchMedia'],
      IntersectionObserver: opts.io === false ? undefined : (FakeIO as unknown as typeof IntersectionObserver),
    };
  };
  const onReveal = (reason: RevealReason) => reasons.push(reason);
  const io = () => FakeIO.instances[0];

  beforeEach(() => {
    FakeIO.instances = [];
    reasons = [];
    motionListeners = [];
    el = document.createElement('section');
    child = document.createElement('button');
    el.appendChild(child);
    document.body.appendChild(el);
    spyOn(el, 'getBoundingClientRect').and.callFake(() => ({ top: INNER_HEIGHT * topRatio }) as DOMRect);
  });

  afterEach(() => el.remove());

  it('arma si el elemento está por debajo de la vista y lo observa al 20 %', () => {
    const handle = revealOnce(el, fakeWindow(), onReveal);
    expect(handle.armed).toBeTrue();
    expect(io().targets).toEqual([el]);
    expect(io().options.threshold).toBe(0.2);
  });

  it('no arma si el elemento ya está a la vista', () => {
    const handle = revealOnce(el, fakeWindow({ topRatio: 0.2 }), onReveal);
    expect(handle.armed).toBeFalse();
    expect(FakeIO.instances.length).toBe(0);
  });

  it('no arma con movimiento reducido', () => {
    expect(revealOnce(el, fakeWindow({ reduced: true }), onReveal).armed).toBeFalse();
  });

  it('no arma con un enlace directo a un elemento de la página', () => {
    const target = document.createElement('div');
    target.id = 'contacto-prueba';
    document.body.appendChild(target);
    expect(revealOnce(el, fakeWindow({ hash: '#contacto-prueba' }), onReveal).armed).toBeFalse();
    target.remove();
  });

  it('con deepLinkIds, un hash a un id que no es de sección no desarma la entrada', () => {
    const target = document.createElement('h3');
    target.id = 'sobre-title';
    document.body.appendChild(target);
    const win = fakeWindow({ hash: '#sobre-title' });
    expect(revealOnce(el, win, onReveal, { deepLinkIds: ['reel', 'contacto'] }).armed).toBeTrue();
    target.remove();
  });

  it('con deepLinkIds, un hash a una sección que existe sí desarma la entrada', () => {
    const target = document.createElement('section');
    target.id = 'contacto';
    document.body.appendChild(target);
    expect(revealOnce(el, fakeWindow({ hash: '#contacto' }), onReveal, { deepLinkIds: ['reel', 'contacto'] }).armed).toBeFalse();
    target.remove();
  });

  it('arma con un hash que no apunta a nada', () => {
    expect(revealOnce(el, fakeWindow({ hash: '#nada-de-nada' }), onReveal).armed).toBeTrue();
  });

  it('no arma sin IntersectionObserver ni sin ventana, y no falla', () => {
    expect(revealOnce(el, fakeWindow({ io: false }), onReveal).armed).toBeFalse();
    expect(revealOnce(el, null, onReveal).armed).toBeFalse();
    expect(() => revealOnce(el, undefined, onReveal).destroy()).not.toThrow();
  });

  it('entra una sola vez al verse y desconecta el observador', () => {
    revealOnce(el, fakeWindow(), onReveal);
    io().fire(true);
    io().fire(true);
    expect(reasons).toEqual(['visible']);
    expect(io().disconnected).toBeTrue();
  });

  it('no entra al salir de la vista', () => {
    revealOnce(el, fakeWindow(), onReveal);
    io().fire(false);
    expect(reasons).toEqual([]);
  });

  it('el foco dentro del elemento dispara la entrada', () => {
    revealOnce(el, fakeWindow(), onReveal);
    child.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
    child.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
    expect(reasons).toEqual(['focus']);
  });

  it('al activarse el movimiento reducido entra y avisa del motivo', () => {
    revealOnce(el, fakeWindow(), onReveal);
    motionListeners.forEach((l) => l({ matches: false } as MediaQueryListEvent));
    expect(reasons).toEqual([]);
    motionListeners.forEach((l) => l({ matches: true } as MediaQueryListEvent));
    expect(reasons).toEqual(['reduced-motion']);
    expect(motionListeners.length).toBe(0);
  });

  it('destroy limpia sin llamar a onReveal', () => {
    const handle = revealOnce(el, fakeWindow(), onReveal);
    handle.destroy();
    io().fire(true);
    child.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
    expect(reasons).toEqual([]);
    expect(io().disconnected).toBeTrue();
    expect(motionListeners.length).toBe(0);
  });

  it('acepta umbrales propios', () => {
    revealOnce(el, fakeWindow({ topRatio: 0.7 }), onReveal, { armRatio: 0.8, showRatio: 0.6 });
    expect(FakeIO.instances.length).toBe(0);
    revealOnce(el, fakeWindow({ topRatio: 0.9 }), onReveal, { armRatio: 0.8, showRatio: 0.6 });
    expect(io().options.threshold).toBe(0.6);
  });
});
