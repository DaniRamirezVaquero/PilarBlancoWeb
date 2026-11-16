import { ComponentFixture, DeferBlockBehavior, DeferBlockState, TestBed } from '@angular/core/testing';
import { SignatureComponent } from './signature.component';
import { SIGNATURE_APPROVED, SIGNATURE_SURNAME } from '../../data/signature.data';
import { SIGNATURE_STROKES } from '../../data/signature-strokes.data';

/** IntersectionObserver de mentira: guarda cada instancia para disparar sus entradas a mano. */
class FakeIO {
  static instances: FakeIO[] = [];
  readonly targets: Element[] = [];
  constructor(private readonly callback: IntersectionObserverCallback, readonly options: IntersectionObserverInit = {}) {
    FakeIO.instances.push(this);
  }
  observe(target: Element): void { this.targets.push(target); }
  unobserve(): void { /* sin uso */ }
  disconnect(): void { this.targets.length = 0; }
  takeRecords(): IntersectionObserverEntry[] { return []; }
  fire(isIntersecting: boolean): void {
    this.callback([{ target: this.targets[0], isIntersecting } as IntersectionObserverEntry], this as unknown as IntersectionObserver);
  }
}

describe('SignatureComponent', () => {
  const globals = window as unknown as Record<'IntersectionObserver', unknown>;
  const originalIO = globals.IntersectionObserver;
  const originalUrl = location.pathname + location.search + location.hash;
  let fixture: ComponentFixture<SignatureComponent>;
  let host: HTMLElement;

  /** Crea la firma con el interruptor y la preferencia de movimiento indicados, por debajo de la vista. */
  const create = async (approved: boolean, reduced = false, renderVector = approved) => {
    await TestBed.configureTestingModule({
      imports: [SignatureComponent],
      providers: [{ provide: SIGNATURE_APPROVED, useValue: approved }],
      // El chunk de los trazos (@defer) se renderiza a mano: así se prueba cuándo se pide y cuándo no.
      deferBlockBehavior: DeferBlockBehavior.Manual,
    }).compileComponents();
    spyOn(window, 'matchMedia').and.callFake((query: string) => ({
      matches: reduced && query.includes('prefers-reduced-motion'),
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
    }) as unknown as MediaQueryList);
    fixture = TestBed.createComponent(SignatureComponent);
    host = fixture.nativeElement as HTMLElement;
    document.body.appendChild(host);
    const rect = Element.prototype.getBoundingClientRect;
    spyOn(Element.prototype, 'getBoundingClientRect').and.callFake(function (this: Element) {
      return this === host ? ({ top: window.innerHeight * 1.5 } as DOMRect) : rect.call(this);
    });
    fixture.detectChanges();
    // afterNextRender lee la vista previa y arma tras el primer render: otra pasada lo pinta.
    fixture.detectChanges();
    if (renderVector) {
      await renderDefer(DeferBlockState.Complete);
    }
  };
  const renderDefer = async (state: DeferBlockState) => {
    const [block] = await fixture.getDeferBlocks();
    await block.render(state);
    fixture.detectChanges();
  };
  const strokes = () => host.querySelectorAll<SVGPathElement>('path.sig-stroke');

  beforeEach(() => {
    FakeIO.instances = [];
    globals.IntersectionObserver = FakeIO;
  });

  afterEach(() => {
    fixture.destroy();
    host.remove();
    globals.IntersectionObserver = originalIO;
    history.replaceState(null, '', originalUrl);
  });

  const surname = () => host.querySelector('text.sig-surname') as SVGTextElement;

  it('sin aprobar, muestra «Pilar» estática con «BLANCO» y ningún trazo', async () => {
    await create(false);
    expect(host.querySelectorAll('.sig-static').length).toBe(1);
    expect(surname().textContent?.trim()).toBe('BLANCO');
    expect(strokes().length).toBe(0);
    expect(host.classList).not.toContain('is-armed');
  });

  it('sin aprobar y sin ?firma=trazo, el bloque del vector no se carga (queda en su marcador)', async () => {
    await create(false);
    const [block] = await fixture.getDeferBlocks();
    expect(strokes().length).toBe(0);
    expect(block).toBeDefined();
    expect(host.querySelector('g[app-signature-vector]')).toBeNull();
  });

  it('con el vector cargado se retira el respaldo estático y se pinta «BLANCO» una sola vez', async () => {
    await create(true);
    expect(host.querySelector('.sig-static')).toBeNull();
    expect(host.querySelectorAll('text.sig-surname').length).toBe(1);
    expect(host.getAttribute('aria-label')).toBe('Pilar Blanco');
  });

  it('mientras el vector no está dibujado se ve el respaldo (sin hueco)', async () => {
    await create(true, false, false);
    expect(host.querySelector('.sig-static')).not.toBeNull();
  });

  it('«BLANCO» va en el mismo SVG, con la posición y el tracking del lockup', async () => {
    await create(true);
    const text = surname();
    expect(host.querySelector('svg.sig-svg')?.contains(text)).toBeTrue();
    expect(text.getAttribute('textLength')).toBe(String(SIGNATURE_SURNAME.textLength));
    expect(text.getAttribute('x')).toBe(String(SIGNATURE_SURNAME.x));
    expect(getComputedStyle(text).fontWeight).toBe('300');
  });

  it('«BLANCO» entra cuando acaba el último trazo', async () => {
    await create(true);
    const last = Array.from(strokes()).at(-1) as SVGPathElement;
    const lastEnd = parseFloat(last.style.getPropertyValue('--sig-delay')) + SIGNATURE_STROKES[SIGNATURE_STROKES.length - 1].ms;
    expect(parseFloat(host.style.getPropertyValue('--sig-surname-delay'))).toBeGreaterThan(lastEnd);
  });

  it('aprobada, pinta el vector: un trazo por gesto, en orden y con su retardo', async () => {
    await create(true);
    expect(strokes().length).toBe(SIGNATURE_STROKES.length);
    expect(strokes()[0].getAttribute('d')).toBe(SIGNATURE_STROKES[0].d);
    expect(strokes()[0].getAttribute('pathLength')).toBe('1');
    const delays = Array.from(strokes()).map((p) => parseFloat(p.style.getPropertyValue('--sig-delay')));
    expect(delays).toEqual([...delays].sort((a, b) => a - b));
    expect(host.querySelector('.sig-static')).toBeNull();
  });

  it('con ?firma=trazo enseña el vector aunque no esté aprobada', async () => {
    history.replaceState(null, '', location.pathname + '?firma=trazo');
    await create(false, false, true);
    expect(strokes().length).toBe(SIGNATURE_STROKES.length);
  });

  it('reserva su caja con «BLANCO» incluido y se lee una vez como «Pilar Blanco»', async () => {
    await create(false);
    expect(host.style.aspectRatio.replace(/\s/g, '')).toBe('680/270');
    expect(host.getAttribute('role')).toBe('img');
    expect(host.getAttribute('aria-label')).toBe('Pilar Blanco');
    expect(host.querySelector('svg')?.getAttribute('aria-hidden')).toBe('true');
  });

  it('con movimiento reducido no se arma: la firma se ve entera', async () => {
    await create(true, true);
    expect(host.classList).not.toContain('is-armed');
    expect(getComputedStyle(strokes()[0]).strokeDashoffset).toBe('0px');
    expect(getComputedStyle(surname()).opacity).toBe('1');
  });

  it('se arma por debajo de la vista y se escribe al verse el 60 %', async () => {
    await create(true);
    expect(host.classList).toContain('is-armed');
    const io = FakeIO.instances[0];
    expect(io.options.threshold).toBe(0.6);
    expect(getComputedStyle(surname()).opacity).toBe('0');
    io.fire(true);
    fixture.detectChanges();
    expect(host.classList).toContain('is-shown');
  });
});
