import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { PrincipalComponent } from './principal.component';
import { NavService } from '../../services/nav.service';
import { VOICE } from '../../data/portfolio.data';

/** IntersectionObserver de mentira: guarda cada instancia para disparar sus entradas a mano. */
class FakeIntersectionObserver {
  static instances: FakeIntersectionObserver[] = [];
  readonly targets: Element[] = [];

  constructor(
    private readonly callback: IntersectionObserverCallback,
    readonly options: IntersectionObserverInit = {},
  ) {
    FakeIntersectionObserver.instances.push(this);
  }

  observe(target: Element): void { this.targets.push(target); }
  unobserve(): void { /* sin uso */ }
  disconnect(): void { this.targets.length = 0; }
  takeRecords(): IntersectionObserverEntry[] { return []; }

  fire(target: Element, isIntersecting: boolean, intersectionRatio = isIntersecting ? 1 : 0): void {
    const entry = { target, isIntersecting, intersectionRatio } as IntersectionObserverEntry;
    this.callback([entry], this as unknown as IntersectionObserver);
  }
}

describe('PrincipalComponent', () => {
  const globals = window as unknown as Record<'IntersectionObserver' | 'Audio', unknown>;
  const originalIO = globals.IntersectionObserver;
  const originalAudio = globals.Audio;
  let fixture: ComponentFixture<PrincipalComponent>;
  let component: PrincipalComponent;
  let host: HTMLElement;
  let nav: NavService;
  let audio: HTMLAudioElement | null;
  let motionListeners: ((event: MediaQueryListEvent) => void)[];

  /** Posición del reel respecto a la ventana al cargar la home (fracción del alto de la ventana). */
  let reelTopRatio: number;

  /** Simula la preferencia de movimiento del sistema antes de crear la home. */
  const create = (reduced: boolean) => {
    spyOn(window, 'matchMedia').and.callFake((query: string) => ({
      matches: reduced && query.includes('prefers-reduced-motion'),
      addEventListener: (_type: string, listener: (event: MediaQueryListEvent) => void) => motionListeners.push(listener),
      removeEventListener: () => undefined,
    }) as unknown as MediaQueryList);
    fixture = TestBed.createComponent(PrincipalComponent);
    component = fixture.componentInstance;
    host = fixture.nativeElement as HTMLElement;
    nav = TestBed.inject(NavService);
    document.body.appendChild(host);
    fixture.detectChanges();
  };

  const house = () => host.querySelector('.home-house') as HTMLElement;
  const reel = () => host.querySelector('#reel') as HTMLElement;
  const filmStrip = () => host.querySelector('app-film-strip') as HTMLElement;
  const pilot = () => host.querySelector('app-on-air-pilot') as HTMLElement;
  const playButton = (index: number) => host.querySelectorAll<HTMLButtonElement>('.cart')[index];
  const monitorTrack = () => host.querySelector('.monitor-track') as HTMLElement;
  /** El observador propio del reel: el que dispara su entrada al 15 % visible. */
  const reelObserver = () => FakeIntersectionObserver.instances.find((io) => io.options.threshold === 0.15);

  const setSection = (id: string | null) => {
    nav.activeSection.set(id);
    fixture.detectChanges();
  };

  const audioEvent = (type: string) => {
    audio?.dispatchEvent(new Event(type));
    fixture.detectChanges();
  };

  beforeEach(async () => {
    FakeIntersectionObserver.instances = [];
    motionListeners = [];
    audio = null;
    reelTopRatio = 1.5;
    // Se sustituyen a mano (no con spyOn): el código los usa con `new`.
    globals.IntersectionObserver = FakeIntersectionObserver;
    // El reel se coloca donde diga cada test, sin depender del tamaño de ventana de ChromeHeadless.
    const rect = Element.prototype.getBoundingClientRect;
    spyOn(Element.prototype, 'getBoundingClientRect').and.callFake(function (this: Element) {
      if (this.id === 'reel') {
        const top = window.innerHeight * reelTopRatio;
        return { top, bottom: top + 800, left: 0, right: 0, width: 0, height: 800, x: 0, y: top } as DOMRect;
      }
      return rect.call(this);
    });
    // El audio real de voice-strip: se captura para lanzar sus eventos.
    globals.Audio = function FakeAudio() {
      audio = document.createElement('audio');
      return audio;
    };
    spyOn(HTMLMediaElement.prototype, 'play').and.resolveTo();
    spyOn(HTMLMediaElement.prototype, 'pause').and.callFake(function (this: HTMLMediaElement) {
      this.dispatchEvent(new Event('pause'));
    });
    spyOn(HTMLMediaElement.prototype, 'load').and.stub();
    await TestBed.configureTestingModule({
      imports: [PrincipalComponent],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  afterEach(() => {
    fixture.destroy();
    globals.IntersectionObserver = originalIO;
    globals.Audio = originalAudio;
    host.remove();
    history.replaceState(null, '', location.pathname + location.search);
    document.documentElement.removeAttribute('data-hero');
    document.documentElement.removeAttribute('data-theme');
  });

  describe('sala «se apagan las luces»', () => {
    it('apaga las luces de la sala cuando el reel es la sección activa', () => {
      create(false);
      setSection('reel');
      expect(house().classList).toContain('lights-down');
    });

    it('vuelve a encender las luces al salir del reel', () => {
      create(false);
      setSection('reel');
      setSection('fotos');
      expect(house().classList).not.toContain('lights-down');
    });

    it('con movimiento reducido también oscurece la sala (sin transición) pero no arma la entrada', () => {
      create(true);
      setSection('reel');
      expect(house().classList).toContain('lights-down');
      expect(reel().classList).not.toContain('is-armed');
    });
  });

  describe('entrada del reel', () => {
    it('se arma si el reel aún no se ve al cargar la home', () => {
      create(false);
      expect(reel().classList).toContain('is-armed');
      expect(reel().classList).not.toContain('is-shown');
    });

    it('no se arma si el reel ya está a la vista al cargar', () => {
      reelTopRatio = 0.2;
      create(false);
      expect(reel().classList).not.toContain('is-armed');
      expect(filmStrip().inert).toBeFalse();
    });

    it('no se arma con un enlace directo a otra sección', () => {
      history.replaceState(null, '', '#fotos');
      create(false);
      expect(reel().classList).not.toContain('is-armed');
    });

    it('entra al verse el 15 % del reel, aunque la barra marque otra sección', () => {
      create(false);
      setSection('fotos');
      reelObserver()?.fire(reel(), true, 0.2);
      fixture.detectChanges();
      expect(reel().classList).toContain('is-shown');
    });

    it('la entrada ocurre una sola vez: is-shown se queda al salir de la vista', () => {
      create(false);
      reelObserver()?.fire(reel(), true, 0.2);
      fixture.detectChanges();
      reelObserver()?.fire(reel(), false);
      fixture.detectChanges();
      expect(reel().classList).toContain('is-shown');
    });

    it('mientras está armada, la tira oculta no recibe el foco', () => {
      create(false);
      expect(filmStrip().inert).toBeTrue();
      const link = filmStrip().querySelector('a') as HTMLAnchorElement;
      link.focus();
      expect(document.activeElement).not.toBe(link);
    });

    it('el foco dentro del reel dispara la entrada y la tira vuelve a ser enfocable', () => {
      create(false);
      const facade = reel().querySelector('app-vimeo-facade') as HTMLElement;
      facade.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
      fixture.detectChanges();
      expect(reel().classList).toContain('is-shown');
      expect(filmStrip().inert).toBeFalse();
    });

    it('si se activa el movimiento reducido con la entrada armada, se desarma', () => {
      create(false);
      motionListeners.forEach((listener) => listener({ matches: true } as MediaQueryListEvent));
      fixture.detectChanges();
      expect(reel().classList).not.toContain('is-armed');
      expect(filmStrip().inert).toBeFalse();
    });
  });

  it('muestra la hoja de contactos en lugar del carrusel', () => {
    create(false);
    expect(host.querySelector('app-contact-sheet')).not.toBeNull();
    expect(host.querySelector('app-carousel')).toBeNull();
  });

  describe('Voz «en el aire»', () => {
    it('en reposo, la banda de monitor muestra la primera demo y el piloto está apagado', () => {
      create(false);
      expect(host.querySelector('.voz-monitor .monitor-demo')?.firstChild?.textContent?.trim()).toBe(VOICE[0].label);
      expect(host.querySelector('#voz > app-on-air-wave')).toBeNull();
      expect(pilot().classList).not.toContain('is-live');
    });

    it('al pulsar una demo y empezar a sonar, la banda la sigue y el piloto se enciende', () => {
      create(false);
      playButton(2).click();
      fixture.detectChanges();
      audioEvent('playing');
      expect(host.querySelector('.monitor-demo')?.firstChild?.textContent?.trim()).toBe(VOICE[2].label);
      expect(component.airDemo()).toBe(VOICE[2]);
      expect(pilot().classList).toContain('is-live');
    });

    it('el avance del audio llega a la onda de la banda', () => {
      create(false);
      playButton(1).click();
      audioEvent('playing');
      spyOnProperty(HTMLMediaElement.prototype, 'duration', 'get').and.returnValue(10);
      spyOnProperty(HTMLMediaElement.prototype, 'currentTime', 'get').and.returnValue(4);
      audioEvent('timeupdate');
      expect(component.airProgress()).toBeCloseTo(0.4, 5);
      const played = host.querySelector('.monitor-wave .wave-played') as SVGElement;
      expect(played.style.transform).toBe('translateX(60%)');
    });

    it('al pausar, el piloto se apaga y la banda conserva la demo', () => {
      create(false);
      playButton(1).click();
      audioEvent('playing');
      playButton(1).click();
      fixture.detectChanges();
      expect(pilot().classList).not.toContain('is-live');
      expect(component.airDemo()).toBe(VOICE[1]);
    });
    it('las demos de la home son cartuchos: sin onda propia, la onda está solo en el monitor', () => {
      create(false);
      expect(host.querySelectorAll('.cart').length).toBe(VOICE.length);
      expect(host.querySelector('.voice-track')).toBeNull();
      expect(host.querySelectorAll('app-on-air-wave').length).toBe(1);
    });

    it('la onda del monitor es un slider con el tiempo de la demo cargada', () => {
      create(false);
      expect(monitorTrack().getAttribute('role')).toBe('slider');
      expect(monitorTrack().getAttribute('aria-valuetext')).toBe(`0:00 de 0:${VOICE[0].duration}`);
      playButton(1).click();
      audioEvent('playing');
      spyOnProperty(HTMLMediaElement.prototype, 'duration', 'get').and.returnValue(10);
      spyOnProperty(HTMLMediaElement.prototype, 'currentTime', 'get').and.returnValue(5);
      audioEvent('timeupdate');
      expect(monitorTrack().getAttribute('aria-label')).toBe(`Posición en ${VOICE[1].label}`);
      expect(monitorTrack().getAttribute('aria-valuenow')).toBe('50');
      expect(host.querySelector('.monitor-time')?.textContent?.trim()).toBe('0:23 / 0:46');
    });

    it('pulsar en la onda del monitor salta dentro de la demo cargada', () => {
      create(false);
      playButton(1).click();
      audioEvent('playing');
      const strip = component['strip']()!;
      const seek = spyOn(strip, 'seek');
      monitorTrack().click();
      expect(seek).toHaveBeenCalledWith(jasmine.any(MouseEvent), 1);
    });

    it('Enter sobre el monitor en reposo arranca la primera demo', () => {
      create(false);
      monitorTrack().dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', cancelable: true }));
      fixture.detectChanges();
      expect(component.airDemo()).toBe(VOICE[0]);
      expect(HTMLMediaElement.prototype.play).toHaveBeenCalled();
    });
  });

  it('conserva las anclas de la barra', () => {
    create(false);
    for (const id of ['reel', 'fotos', 'voz', 'trayectoria', 'contacto']) {
      expect(host.querySelector(`#${id}`)).withContext(id).not.toBeNull();
    }
  });
});
