import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreditsRollComponent } from './credits-roll.component';
import { HIGHLIGHT_CREDITS } from '../../data/portfolio.data';

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

describe('CreditsRollComponent', () => {
  const globals = window as unknown as Record<'IntersectionObserver', unknown>;
  const originalIO = globals.IntersectionObserver;
  let fixture: ComponentFixture<CreditsRollComponent>;
  let host: HTMLElement;
  let topRatio: number;

  /** Crea los créditos con la preferencia de movimiento indicada (por defecto, por debajo de la vista). */
  const create = (reduced = false) => {
    spyOn(window, 'matchMedia').and.callFake((query: string) => ({
      matches: reduced && query.includes('prefers-reduced-motion'),
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
    }) as unknown as MediaQueryList);
    fixture = TestBed.createComponent(CreditsRollComponent);
    host = fixture.nativeElement as HTMLElement;
    document.body.appendChild(host);
    const rect = Element.prototype.getBoundingClientRect;
    spyOn(Element.prototype, 'getBoundingClientRect').and.callFake(function (this: Element) {
      return this === host ? ({ top: window.innerHeight * topRatio } as DOMRect) : rect.call(this);
    });
    fixture.componentRef.setInput('credits', HIGHLIGHT_CREDITS);
    fixture.detectChanges();
    // afterNextRender arma tras el primer render: otra pasada pinta las clases del host.
    fixture.detectChanges();
  };
  const rows = () => Array.from(host.querySelectorAll<HTMLLIElement>('li.roll-row'));

  beforeEach(async () => {
    FakeIO.instances = [];
    topRatio = 1.5;
    globals.IntersectionObserver = FakeIO;
    await TestBed.configureTestingModule({ imports: [CreditsRollComponent] }).compileComponents();
  });

  afterEach(() => {
    fixture.destroy();
    host.remove();
    globals.IntersectionObserver = originalIO;
  });

  it('pinta los 6 créditos en orden', () => {
    create();
    expect(rows().length).toBe(6);
    expect(rows().map((li) => li.querySelector('.roll-title')?.textContent?.replace(/\(se abre en otra pestaña\)/, '').trim()))
      .toEqual(HIGHLIGHT_CREDITS.map((c) => c.title));
  });

  it('cada fila lleva el título y, debajo, quién y el formato', () => {
    create();
    rows().forEach((li, i) => {
      expect(li.querySelector('.roll-title')).not.toBeNull();
      expect(li.querySelector('.roll-by')?.textContent).toContain(HIGHLIGHT_CREDITS[i].by);
      expect(li.querySelector('.roll-note')?.textContent).toBe(HIGHLIGHT_CREDITS[i].note ?? '');
      expect(li.firstElementChild?.classList).toContain('roll-title');
    });
  });

  it('el título manda: es más grande que quién y el formato', () => {
    create();
    const size = (sel: string) => parseFloat(getComputedStyle(host.querySelector(sel) as HTMLElement).fontSize);
    expect(size('.roll-title')).toBeGreaterThan(size('.roll-by') * 1.6);
  });

  it('nada de esquela: sin mayúsculas forzadas ni años', () => {
    create();
    const title = host.querySelector('.roll-title') as HTMLElement;
    expect(getComputedStyle(title).textTransform).toBe('none');
    expect(getComputedStyle(host.querySelector('.roll-note') as HTMLElement).textTransform).toBe('none');
    expect(/\d{4}/.test(host.textContent ?? '')).toBeFalse();
  });

  it('los enlaces externos se abren aparte y lo anuncian', () => {
    create();
    const links = Array.from(host.querySelectorAll<HTMLAnchorElement>('a.roll-link'));
    expect(links.length).toBe(HIGHLIGHT_CREDITS.filter((c) => c.url).length);
    links.forEach((a) => {
      expect(a.target).toBe('_blank');
      expect(a.rel).toContain('noopener');
      expect(a.querySelector('.sr-only')?.textContent).toContain('(se abre en otra pestaña)');
    });
  });

  it('la última palabra del título va unida al icono', () => {
    create();
    const tail = host.querySelector('a.roll-link .whitespace-nowrap') as HTMLElement;
    expect(tail.textContent).toContain('mí');
    expect(tail.querySelector('app-icon')).not.toBeNull();
  });

  it('con movimiento reducido no se arma: todo queda colocado', () => {
    create(true);
    expect(host.classList).not.toContain('is-armed');
  });

  it('si ya se ve al cargar, no se arma', () => {
    topRatio = 0.2;
    create();
    expect(host.classList).not.toContain('is-armed');
  });

  it('se arma por debajo de la vista y entra al verse, con el retardo por fila', () => {
    create();
    expect(host.classList).toContain('is-armed');
    expect(host.classList).not.toContain('is-shown');
    FakeIO.instances[0].fire(true);
    fixture.detectChanges();
    expect(host.classList).toContain('is-shown');
    expect(rows()[3].style.getPropertyValue('--row')).toBe('3');
  });

  it('el foco dentro de los créditos armados los muestra al instante', () => {
    create();
    (host.querySelector('a.roll-link') as HTMLAnchorElement).focus();
    fixture.detectChanges();
    expect(host.classList).toContain('is-shown');
  });
});
