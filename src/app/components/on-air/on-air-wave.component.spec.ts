import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OnAirWaveComponent } from './on-air-wave.component';
import { VOICE } from '../../data/portfolio.data';

describe('OnAirWaveComponent', () => {
  let fixture: ComponentFixture<OnAirWaveComponent>;
  let component: OnAirWaveComponent;
  let host: HTMLElement;

  const played = () => host.querySelector('.played') as HTMLElement;
  const playedSvg = () => host.querySelector('.wave-played') as SVGElement;
  const heights = () => Array.from(host.querySelectorAll('.wave-rest rect')).map((r) => r.getAttribute('height'));

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [OnAirWaveComponent] }).compileComponents();
    fixture = TestBed.createComponent(OnAirWaveComponent);
    component = fixture.componentInstance;
    host = fixture.nativeElement as HTMLElement;
    fixture.componentRef.setInput('peaks', VOICE[0].peaks);
    // Tamaño fijo: no se espera al ResizeObserver.
    component.box.set({ w: 600, h: 200 });
    component.measured.set(true);
    fixture.detectChanges();
  });

  afterEach(() => fixture.destroy());

  it('dibuja a escala 1:1: el viewBox es el tamaño real del fondo', () => {
    const svgs = Array.from(host.querySelectorAll('svg'));
    expect(svgs.length).toBe(2);
    svgs.forEach((svg) => expect(svg.getAttribute('viewBox')).toBe('0 0 600 200'));
  });

  it('pone barras de 4 px cada ~12 px', () => {
    const rects = host.querySelectorAll('.wave-rest rect');
    expect(rects.length).toBe(50);
    expect(host.querySelectorAll('.wave-played rect').length).toBe(50);
    expect(rects[0].getAttribute('width')).toBe('4');
  });

  it('muestra el avance moviendo solo transform', () => {
    fixture.componentRef.setInput('progress', 0.25);
    fixture.detectChanges();
    expect(played().style.transform).toBe('translateX(-75%)');
    expect(playedSvg().style.transform).toBe('translateX(75%)');
  });

  it('limita el avance a [0, 1] y trata NaN como 0', () => {
    const cases: [number, string][] = [[1.7, '0%'], [-1, '100%'], [Number.NaN, '100%']];
    for (const [progress, shift] of cases) {
      fixture.componentRef.setInput('progress', progress);
      fixture.detectChanges();
      expect(playedSvg().style.transform).toBe(`translateX(${shift})`);
    }
  });

  it('cambia de forma al cambiar de pista', () => {
    const before = heights();
    fixture.componentRef.setInput('peaks', VOICE[2].peaks);
    fixture.detectChanges();
    expect(heights()).not.toEqual(before);
  });

  it('creada en el navegador sin HTML del servidor, se oculta solo hasta la primera medida', () => {
    const fresh = TestBed.createComponent(OnAirWaveComponent);
    fresh.componentRef.setInput('peaks', VOICE[1].peaks);
    fresh.detectChanges();
    const el = fresh.nativeElement as HTMLElement;
    expect(el.classList.contains('is-measuring')).toBeTrue();
    fresh.componentInstance.measured.set(true);
    fresh.detectChanges();
    expect(el.classList.contains('is-measuring')).toBeFalse();
    fresh.destroy();
  });

  it('es decorativa y marca el estado en el host', () => {
    expect(host.getAttribute('aria-hidden')).toBe('true');
    expect(host.classList.contains('is-live')).toBeFalse();
    fixture.componentRef.setInput('live', true);
    fixture.detectChanges();
    expect(host.classList.contains('is-live')).toBeTrue();
  });
});
