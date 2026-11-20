import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PosterWallComponent } from './poster-wall.component';
import { REEL, SCENES, Video } from '../../data/portfolio.data';
import { POSTER_FRAMING } from '../../data/screens.data';
import { slugify } from '../../utils/slug';

describe('PosterWallComponent', () => {
  const billboard: readonly Video[] = [REEL, ...SCENES];
  let fixture: ComponentFixture<PosterWallComponent>;
  let host: HTMLElement;

  const create = (videos: readonly Video[] = billboard) => {
    fixture = TestBed.createComponent(PosterWallComponent);
    host = fixture.nativeElement as HTMLElement;
    fixture.componentRef.setInput('videos', videos);
    fixture.detectChanges();
  };
  const buttons = () => Array.from(host.querySelectorAll<HTMLButtonElement>('button.poster'));

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [PosterWallComponent] }).compileComponents();
  });

  afterEach(() => fixture.destroy());

  it('pinta un cartel por vídeo, en orden, con su ancla y su título', () => {
    create();
    const slots = Array.from(host.querySelectorAll('li.wall-slot'));
    expect(slots.map((li) => li.id)).toEqual(billboard.map((v) => slugify(v.label)));
    expect(Array.from(host.querySelectorAll('.poster-title')).map((n) => n.textContent?.trim()))
      .toEqual(billboard.map((v) => v.label));
  });

  it('cada póster es decorativo, perezoso, con srcset y el encuadre de sus datos', () => {
    create();
    const imgs = Array.from(host.querySelectorAll('img'));
    imgs.forEach((img, i) => {
      expect(img.getAttribute('alt')).toBe('');
      expect(img.getAttribute('loading')).toBe('lazy');
      expect(img.getAttribute('srcset')).toContain('640w');
      expect(img.style.objectPosition).toBe(POSTER_FRAMING[billboard[i].videoId].position);
    });
  });

  it('sin encuadre en los datos, centra el póster', () => {
    create([{ ...REEL, videoId: '1', label: 'Otro' }]);
    expect((host.querySelector('img') as HTMLImageElement).style.objectPosition).toBe('50% 50%');
  });

  it('marca con aria-current solo el cartel en pantalla', () => {
    create();
    fixture.componentRef.setInput('current', SCENES[1].videoId);
    fixture.detectChanges();
    expect(buttons().map((b) => b.getAttribute('aria-current'))).toEqual([null, null, 'true', null]);
  });

  it('al pulsar un cartel pide ese vídeo, con un nombre accesible claro', () => {
    create();
    const chosen: Video[] = [];
    fixture.componentInstance.choose.subscribe((v) => chosen.push(v));
    buttons()[3].click();
    expect(chosen).toEqual([SCENES[2]]);
    expect(buttons()[3].getAttribute('aria-label')).toBe(`Ver en pantalla: ${SCENES[2].label}`);
  });

  it('si falla el póster vivo, usa el guardado y quita el srcset', () => {
    create();
    const img = host.querySelector('img') as HTMLImageElement;
    img.dispatchEvent(new Event('error'));
    fixture.detectChanges();
    expect(img.getAttribute('src')).toBe(REEL.fallbackPoster);
    expect(img.hasAttribute('srcset')).toBeFalse();
    // Los demás siguen con el vivo.
    expect(host.querySelectorAll('img')[1].getAttribute('srcset')).toContain('640w');
  });
});
