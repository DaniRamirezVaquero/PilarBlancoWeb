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

  it('B2: una flecha sobre una pista inactiva la activa y reproduce', () => {
    track(1).dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', cancelable: true }));
    expect(component.active()).toBe(1);
    expect(playSpy).toHaveBeenCalled();
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
});
