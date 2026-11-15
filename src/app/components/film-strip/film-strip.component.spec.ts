import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { FilmStripComponent } from './film-strip.component';
import { SCENES } from '../../data/portfolio.data';
import { slugify } from '../../utils/slug';

describe('FilmStripComponent', () => {
  let fixture: ComponentFixture<FilmStripComponent>;
  let host: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilmStripComponent],
      providers: [provideRouter([])],
    }).compileComponents();
    fixture = TestBed.createComponent(FilmStripComponent);
    host = fixture.nativeElement as HTMLElement;
    fixture.componentRef.setInput('scenes', SCENES);
    fixture.detectChanges();
  });

  afterEach(() => fixture.destroy());

  it('pinta un fotograma por escena, con su nombre', () => {
    const labels = Array.from(host.querySelectorAll('.scene-label')).map((n) => n.textContent?.trim());
    expect(labels).toEqual(SCENES.map((scene) => scene.label));
  });

  it('cada fotograma enlaza al ancla de su escena en /video', () => {
    const hrefs = Array.from(host.querySelectorAll('a')).map((a) => a.getAttribute('href'));
    expect(hrefs).toEqual(SCENES.map((scene) => `/video#${slugify(scene.label)}`));
  });

  it('si falla la miniatura viva, usa el póster guardado', () => {
    const img = host.querySelector('img') as HTMLImageElement;
    img.dispatchEvent(new Event('error'));
    fixture.detectChanges();
    expect(img.getAttribute('src')).toBe(SCENES[0].fallbackPoster);
  });

  it('reserva el tamaño de las miniaturas', () => {
    const imgs = Array.from(host.querySelectorAll('img'));
    expect(imgs.every((img) => img.getAttribute('width') === '320' && img.getAttribute('height') === '180')).toBeTrue();
  });
});
