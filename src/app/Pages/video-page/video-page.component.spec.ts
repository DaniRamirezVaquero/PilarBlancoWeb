import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { VideoPageComponent } from './video-page.component';
import { REEL, SCENES } from '../../data/portfolio.data';
import { VIMEO_ORIGIN } from '../../utils/vimeo-player-events';

/** IntersectionObserver de mentira: guarda cada instancia para disparar sus entradas a mano. */
class FakeIO {
  static instances: FakeIO[] = [];
  constructor(private readonly callback: IntersectionObserverCallback) { FakeIO.instances.push(this); }
  observe(): void { /* sin uso */ }
  unobserve(): void { /* sin uso */ }
  disconnect(): void { /* se espía en los tests */ }
  takeRecords(): IntersectionObserverEntry[] { return []; }
  fire(ratios: number[]): void {
    this.callback(
      ratios.map((intersectionRatio) => ({ intersectionRatio }) as IntersectionObserverEntry),
      this as unknown as IntersectionObserver,
    );
  }
}

describe('VideoPageComponent', () => {
  let fixture: ComponentFixture<VideoPageComponent>;
  let component: VideoPageComponent;
  let host: HTMLElement;

  const create = async (query: Record<string, string> = {}) => {
    await TestBed.configureTestingModule({
      imports: [VideoPageComponent],
      providers: [{ provide: ActivatedRoute, useValue: { snapshot: { queryParamMap: convertToParamMap(query) } } }],
    }).compileComponents();
    fixture = TestBed.createComponent(VideoPageComponent);
    component = fixture.componentInstance;
    host = fixture.nativeElement as HTMLElement;
    document.body.appendChild(host);
    // Sin desplazar la ventana de Karma.
    spyOn(Element.prototype, 'scrollIntoView').and.stub();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  };

  const house = () => host.querySelector('.house') as HTMLElement;
  const facadeImg = () => host.querySelector('app-vimeo-facade img') as HTMLImageElement | null;
  const iframe = () => host.querySelector('app-vimeo-facade iframe') as HTMLIFrameElement | null;
  const caption = () => (host.querySelector('.screen-name') as HTMLElement).textContent?.trim();

  afterEach(() => {
    fixture.destroy();
    host.remove();
  });

  it('al entrar, el reel en pantalla con su póster prioritario, sin reproductor y con la sala encendida', async () => {
    await create();
    expect(facadeImg()?.getAttribute('src')).toContain(`id=${REEL.videoId}`);
    expect(facadeImg()?.getAttribute('fetchpriority')).toBe('high');
    expect(iframe()).toBeNull();
    expect(caption()).toBe(REEL.label);
    expect(house().classList).not.toContain('lights-down');
    expect(host.querySelectorAll('app-poster-wall li').length).toBe(1 + SCENES.length);
  });

  it('elegir un cartel lo proyecta sonando, lo marca y sube a la pantalla', async () => {
    await create();
    (host.querySelectorAll<HTMLButtonElement>('app-poster-wall button')[3]).click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(iframe()?.getAttribute('src')).toContain(`/video/${SCENES[2].videoId}?`);
    expect(caption()).toBe(SCENES[2].label);
    expect(host.querySelectorAll('app-poster-wall button')[3].getAttribute('aria-current')).toBe('true');
    expect(Element.prototype.scrollIntoView).toHaveBeenCalled();
  });

  it('elegir el cartel del reel arranca el reproductor de la pantalla', async () => {
    await create();
    (host.querySelectorAll<HTMLButtonElement>('app-poster-wall button')[0]).click();
    fixture.detectChanges();
    expect(iframe()?.getAttribute('src')).toContain(`/video/${REEL.videoId}?`);
  });

  it('la sala solo se apaga si el vídeo suena y la pantalla se ve', async () => {
    await create();
    const cases: [boolean, boolean, boolean][] = [[true, true, true], [true, false, false], [false, true, false]];
    for (const [playing, inView, down] of cases) {
      component.playing.set(playing);
      component.screenInView.set(inView);
      fixture.detectChanges();
      expect(house().classList.contains('lights-down')).withContext(`${playing}/${inView}`).toBe(down);
    }
  });

  it('cambiar de escena con una sonando enciende las luces', async () => {
    await create();
    component.playing.set(true);
    component.show(SCENES[0]);
    fixture.detectChanges();
    expect(component.playing()).toBeFalse();
  });

  it('con ?escena= pone esa escena en la pantalla, con su póster y sin sonar', async () => {
    await create({ escena: 'pecadores-de-la-pradera' });
    expect(caption()).toBe(SCENES[2].label);
    expect(iframe()).toBeNull();
    expect(facadeImg()?.getAttribute('src')).toContain(`id=${SCENES[2].videoId}`);
  });

  it('con una ?escena= desconocida se queda el reel', async () => {
    await create({ escena: 'nada' });
    expect(caption()).toBe(REEL.label);
  });

  describe('escucha del reproductor y de la pantalla', () => {
    const globals = window as unknown as Record<'IntersectionObserver', unknown>;
    const originalIO = globals.IntersectionObserver;

    beforeEach(() => {
      FakeIO.instances = [];
      globals.IntersectionObserver = FakeIO;
    });

    afterEach(() => {
      globals.IntersectionObserver = originalIO;
    });

    /** Mensaje del reproductor, como lo entrega el navegador: con origen y ventana de procedencia. */
    const fromPlayer = (data: unknown, source: Window | null) =>
      window.dispatchEvent(new MessageEvent('message', { data, origin: VIMEO_ORIGIN, source }));

    it('el observer de la pantalla atiende a la entrada más reciente', async () => {
      await create();
      // Dos entradas juntas: la última manda.
      FakeIO.instances[0].fire([0, 1]);
      expect(component.screenInView()).toBeTrue();
      FakeIO.instances[0].fire([1, 0]);
      expect(component.screenInView()).toBeFalse();
    });

    it('con ?escena= el póster de esa escena es el prioritario', async () => {
      await create({ escena: 'pecadores-de-la-pradera' });
      expect(facadeImg()?.getAttribute('src')).toContain(`id=${SCENES[2].videoId}`);
      expect(facadeImg()?.getAttribute('fetchpriority')).toBe('high');
      expect(facadeImg()?.getAttribute('loading')).toBe('eager');
    });

    it('pulsar el cartel del vídeo ya cargado le manda play', async () => {
      await create();
      const poster = () => host.querySelectorAll<HTMLButtonElement>('app-poster-wall button')[0];
      poster().click();
      fixture.detectChanges();
      const post = spyOn(iframe()?.contentWindow as Window, 'postMessage') as jasmine.Spy;
      // Segundo clic con el reproductor ya creado (y quizá en pausa)
      poster().click();
      expect(post).toHaveBeenCalledWith(JSON.stringify({ method: 'play' }), VIMEO_ORIGIN);
    });

    it('tras cambiar de cartel escucha al iframe nuevo: play apaga la sala y pause la enciende', async () => {
      await create();
      host.querySelectorAll<HTMLButtonElement>('app-poster-wall button')[1].click();
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();
      const player = iframe()?.contentWindow as Window;
      fromPlayer('{"event":"play"}', player);
      fixture.detectChanges();
      expect(house().classList).toContain('lights-down');
      // Un mensaje de otra ventana no cuenta.
      fromPlayer('{"event":"pause"}', window);
      expect(component.playing()).toBeTrue();
      fromPlayer('{"event":"pause"}', player);
      fixture.detectChanges();
      expect(house().classList).not.toContain('lights-down');
    });

    it('al destruirse deja de escuchar los mensajes y desconecta el observer', async () => {
      await create();
      const removed = spyOn(window, 'removeEventListener').and.callThrough();
      const disconnect = spyOn(FakeIO.instances[0], 'disconnect');
      fixture.destroy();
      expect(removed.calls.allArgs().some(([type]) => type === 'message')).toBeTrue();
      expect(disconnect).toHaveBeenCalled();
    });
  });
});
