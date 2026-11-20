import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VoicePageComponent } from './voice-page.component';
import { VoiceStripComponent } from '../../components/voice-strip/voice-strip.component';
import { OnAirWaveComponent } from '../../components/on-air/on-air-wave.component';
import { By } from '@angular/platform-browser';
import { DUBBING, VOICE } from '../../data/portfolio.data';
import { DUBBING_FRAMING, DUBBING_LINES } from '../../data/screens.data';

describe('VoicePageComponent', () => {
  let fixture: ComponentFixture<VoicePageComponent>;
  let host: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [VoicePageComponent] }).compileComponents();
    fixture = TestBed.createComponent(VoicePageComponent);
    host = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  afterEach(() => fixture.destroy());

  const strip = () => fixture.debugElement.query(By.directive(VoiceStripComponent)).componentInstance as VoiceStripComponent;
  const wave = () => fixture.debugElement.query(By.directive(OnAirWaveComponent)).componentInstance as OnAirWaveComponent;

  it('pone la frase exacta de cada demo de doblaje debajo de su pantalla, en orden', () => {
    const lines = Array.from(host.querySelectorAll('figure.dub figcaption.dub-line')).map((n) => n.textContent?.trim());
    expect(lines).toEqual(DUBBING.map((v) => DUBBING_LINES[v.videoId]));
  });

  it('cada pantalla de doblaje lleva su encuadre en --poster-pos y --poster-zoom', () => {
    const facades = Array.from(host.querySelectorAll<HTMLElement>('app-vimeo-facade'));
    facades.forEach((el, i) => {
      const framing = DUBBING_FRAMING[DUBBING[i].videoId];
      expect(el.style.getPropertyValue('--poster-pos')).toBe(framing.position);
      expect(el.style.getPropertyValue('--poster-zoom')).toBe(String(framing.zoom));
    });
  });

  it('sin armar (prerender, sin JS), las frases se ven', () => {
    expect(host.querySelector('.dub.is-armed')).toBeNull();
  });

  it('en reposo, la onda de fondo es la primera demo y el piloto está apagado', () => {
    expect(wave().peaks()).toBe(VOICE[0].peaks);
    expect(host.querySelector('app-on-air-pilot')?.classList).not.toContain('is-live');
  });

  it('al sonar una demo, el piloto se enciende y la onda de fondo es la suya', () => {
    strip().active.set(1);
    strip().playing.set(1);
    fixture.detectChanges();
    expect(host.querySelector('app-on-air-pilot')?.classList).toContain('is-live');
    expect(wave().peaks()).toBe(VOICE[1].peaks);
  });

  it('las pistas de locución siguen en la variante tracks', () => {
    expect(strip().variant).toBe('tracks');
  });
});
