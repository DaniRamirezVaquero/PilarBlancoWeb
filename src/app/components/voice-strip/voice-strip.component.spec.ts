import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VoiceStripComponent } from './voice-strip.component';
import { VOICE } from '../../data/portfolio.data';

describe('VoiceStripComponent', () => {
  let fixture: ComponentFixture<VoiceStripComponent>;
  let component: VoiceStripComponent;
  let host: HTMLElement;
  let playSpy: jasmine.Spy<() => Promise<void>>;

  const audioOf = (): HTMLAudioElement => (component as unknown as { audio: HTMLAudioElement }).audio;
  const track = (i: number): HTMLElement => host.querySelectorAll<HTMLElement>('.voice-track')[i];
  const abortError = () => new DOMException('The play() request was interrupted', 'AbortError');
  const flush = async () => {
    await Promise.resolve();
    await Promise.resolve();
  };

  /** Sustituye currentTime/duration del audio para registrar lo que escribe el componente. */
  const stubTime = (audio: HTMLAudioElement, duration: number): number[] => {
    const writes: number[] = [];
    Object.defineProperty(audio, 'duration', { value: duration, configurable: true });
    Object.defineProperty(audio, 'currentTime', {
      configurable: true,
      get: () => writes[writes.length - 1] ?? 10,
      set: (v: number) => writes.push(v),
    });
    return writes;
  };

  const clickTrackAt = (el: HTMLElement, ratio: number, index: number) => {
    spyOn(el, 'getBoundingClientRect').and.returnValue({ left: 0 } as DOMRect);
    Object.defineProperty(el, 'offsetWidth', { value: 100, configurable: true });
    component.seek({ currentTarget: el, clientX: ratio * 100 } as unknown as MouseEvent, index);
  };

  beforeEach(async () => {
    playSpy = spyOn(HTMLMediaElement.prototype, 'play').and.resolveTo();
    spyOn(HTMLMediaElement.prototype, 'load').and.stub();
    await TestBed.configureTestingModule({ imports: [VoiceStripComponent] }).compileComponents();
    fixture = TestBed.createComponent(VoiceStripComponent);
    component = fixture.componentInstance;
    host = fixture.nativeElement as HTMLElement;
    fixture.componentRef.setInput('demos', VOICE);
    fixture.detectChanges();
  });

  it('pinta una fila por demo con los nombres definidos', () => {
    const labels = Array.from(host.querySelectorAll('.voice-label')).map((n) => n.textContent?.trim());
    expect(labels).toEqual(['Demo Publicidad', 'Demo 1', 'Demo 2', 'Demo 3']);
  });

  it('dibuja barras de 2px con viewBox igual al tamaño de la pista', () => {
    const svg = host.querySelector('.voice-track svg') as SVGElement;
    const { w, h } = component.box();
    expect(svg.getAttribute('viewBox')).toBe(`0 0 ${w} ${h}`);
    expect((svg.querySelector('.bars rect') as SVGRectElement).getAttribute('width')).toBe('2');
  });

  it('reproduce la pista y la marca como activa', () => {
    component.toggle(1);
    expect(playSpy).toHaveBeenCalledTimes(1);
    expect(component.active()).toBe(1);
    expect(component.loading()).toBeTrue();
  });

  it('B1: un play() abortado por cambiar de pista no marca error ni quita «Cargando…» de la pista nueva', async () => {
    playSpy.and.returnValues(Promise.reject(abortError()), Promise.resolve());
    component.toggle(0);
    component.toggle(2);
    await flush();
    expect(component.failed()).toBeNull();
    expect(component.loading()).toBeTrue();
    expect(component.active()).toBe(2);
  });

  it('B1: un rechazo real del play() sí marca la pista como fallida', async () => {
    playSpy.and.returnValue(Promise.reject(new DOMException('no', 'NotAllowedError')));
    component.toggle(0);
    await flush();
    expect(component.failed()).toBe(0);
    expect(component.loading()).toBeFalse();
  });

  it('B2: el slider de una pista inactiva anuncia 0:00 de la duración', () => {
    expect(track(0).getAttribute('aria-valuetext')).toBe(`0:00 de ${component.format(VOICE[0].duration)}`);
  });

  it('VO3: una flecha sobre una pista inactiva no activa ni carga audio', () => {
    track(1).dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', cancelable: true }));
    expect(component.active()).toBeNull();
    expect(playSpy).not.toHaveBeenCalled();
  });

  it('VO3: Enter y Espacio sobre una pista inactiva la activan y reproducen', () => {
    track(1).dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', cancelable: true }));
    expect(component.active()).toBe(1);
    expect(playSpy).toHaveBeenCalledTimes(1);
    track(2).dispatchEvent(new KeyboardEvent('keydown', { key: ' ', cancelable: true }));
    expect(component.active()).toBe(2);
  });

  it('VO2: anuncia «Cargando» y el fallo en la región viva y enlaza el error con el botón', async () => {
    const status = host.querySelector('[role="status"]') as HTMLElement;
    component.toggle(0);
    fixture.detectChanges();
    expect(status.textContent).toContain('Cargando');
    playSpy.and.returnValue(Promise.reject(new Error('fallo')));
    component.toggle(1);
    await flush();
    fixture.detectChanges();
    expect(status.textContent).toContain('No se pudo cargar');
    const play = host.querySelectorAll('.voice-play')[1];
    expect(play.getAttribute('aria-describedby')).toBe('voice-error-1');
    expect(host.querySelector('#voice-error-1')).not.toBeNull();
  });

  it('B2: flechas, Inicio y Fin mueven la posición de la pista activa', () => {
    component.toggle(0);
    const writes = stubTime(audioOf(), 30);
    const press = (key: string) => track(0).dispatchEvent(new KeyboardEvent('keydown', { key, cancelable: true }));
    press('ArrowRight');
    press('ArrowLeft');
    press('Home');
    press('End');
    expect(writes).toEqual([15, 10, 0, 30]);
  });

  it('B7: un salto pendiente de una pista no se aplica a la pista nueva', () => {
    component.toggle(0);
    const writes = stubTime(audioOf(), 40);
    clickTrackAt(track(0), 0.5, 0);
    component.toggle(2);
    audioOf().dispatchEvent(new Event('loadedmetadata'));
    expect(writes).toEqual([]);
  });

  it('B7: el salto se aplica cuando cargan los metadatos de la misma pista', () => {
    component.toggle(0);
    const writes = stubTime(audioOf(), 40);
    clickTrackAt(track(0), 0.5, 0);
    audioOf().dispatchEvent(new Event('loadedmetadata'));
    expect(writes).toEqual([20]);
  });

  it('B8: al destruir libera el audio', () => {
    component.toggle(0);
    const removeSpy = spyOn(audioOf(), 'removeAttribute').and.callThrough();
    fixture.destroy();
    expect(removeSpy).toHaveBeenCalledWith('src');
  });

  it('B6: la onda solo se oculta hasta medir la pista y luego se ve', async () => {
    // Antes de la primera medida (navegador) el host lleva is-measuring; tras el ResizeObserver desaparece
    await new Promise((resolve) => setTimeout(resolve, 100));
    fixture.detectChanges();
    expect(component.measured()).toBeTrue();
    expect(host.classList.contains('is-measuring')).toBeFalse();
  });
  describe('variante «carts» (cartuchos de emisión)', () => {
    const carts = () => Array.from(host.querySelectorAll<HTMLButtonElement>('.cart'));

    beforeEach(() => {
      fixture.componentRef.setInput('variant', 'carts');
      fixture.detectChanges();
    });

    it('pinta un cartucho por demo, numerado y con su duración, sin onda propia', () => {
      expect(carts().map((c) => c.querySelector('.cart-title')?.textContent?.trim()))
        .toEqual(['Demo Publicidad', 'Demo 1', 'Demo 2', 'Demo 3']);
      expect(carts()[1].querySelector('.cart-number')?.textContent?.trim()).toBe('Nº 2');
      expect(carts()[1].querySelector('.cart-time')?.textContent?.trim()).toBe(component.format(VOICE[1].duration));
      expect(host.querySelector('.voice-track')).toBeNull();
    });

    it('pulsar un cartucho lo carga (sube) y lo reproduce; sonando queda pulsado', () => {
      carts()[2].click();
      fixture.detectChanges();
      expect(playSpy).toHaveBeenCalledTimes(1);
      expect(carts()[2].classList).toContain('is-active');
      audioOf().dispatchEvent(new Event('playing'));
      fixture.detectChanges();
      expect(carts()[2].getAttribute('aria-pressed')).toBe('true');
      expect(carts()[2].classList).toContain('is-live');
      expect(carts()[2].getAttribute('aria-label')).toBe('Pausar demo de voz: Demo 2');
    });

    it('al pausar sigue cargado pero deja de estar en antena', () => {
      carts()[0].click();
      audioOf().dispatchEvent(new Event('playing'));
      audioOf().dispatchEvent(new Event('pause'));
      fixture.detectChanges();
      expect(carts()[0].classList).toContain('is-active');
      expect(carts()[0].classList).not.toContain('is-live');
      expect(carts()[0].getAttribute('aria-pressed')).toBe('false');
    });

    it('un fallo de carga se muestra bajo el cartucho y se enlaza con su botón', async () => {
      playSpy.and.returnValue(Promise.reject(new DOMException('no', 'NotAllowedError')));
      carts()[3].click();
      await flush();
      fixture.detectChanges();
      expect(host.querySelector('#voice-error-3')?.textContent?.trim()).toBe('No se pudo cargar');
      expect(carts()[3].getAttribute('aria-describedby')).toBe('voice-error-3');
    });
  });
});
