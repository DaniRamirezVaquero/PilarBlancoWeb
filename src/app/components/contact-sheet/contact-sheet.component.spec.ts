import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContactSheetComponent } from './contact-sheet.component';
import { BOOK_PHOTOS } from '../../data/photos.data';

describe('ContactSheetComponent', () => {
  let fixture: ComponentFixture<ContactSheetComponent>;
  let host: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [ContactSheetComponent] }).compileComponents();
    fixture = TestBed.createComponent(ContactSheetComponent);
    host = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  afterEach(() => fixture.destroy());

  it('pinta los 12 fotogramas en el orden del book', () => {
    const items = host.querySelectorAll('ol.sheet > li');
    const alts = Array.from(host.querySelectorAll('img')).map((img) => img.getAttribute('alt'));
    expect(items.length).toBe(12);
    expect(alts).toEqual(BOOK_PHOTOS.map((photo) => photo.alt));
  });

  it('numera los fotogramas del 1 al 12 sin que lo lea el lector de pantalla', () => {
    const edges = Array.from(host.querySelectorAll('.frame-edge'));
    expect(edges.map((edge) => edge.textContent?.trim())).toEqual(
      Array.from({ length: 12 }, (_, i) => String(i + 1)),
    );
    // El aria-hidden va en el contenedor de los rótulos del borde (número y emulsión).
    expect(edges.every((edge) => edge.closest('[aria-hidden="true"]') !== null)).toBeTrue();
  });

  it('reserva el tamaño de cada foto y la carga en diferido', () => {
    const imgs = Array.from(host.querySelectorAll('img'));
    expect(imgs.every((img) => img.getAttribute('width') && img.getAttribute('height'))).toBeTrue();
    expect(imgs.every((img) => img.getAttribute('loading') === 'lazy')).toBeTrue();
  });

  it('cada fotograma es un botón con nombre que lo amplía', () => {
    const buttons = Array.from(host.querySelectorAll<HTMLButtonElement>('button.frame-open'));
    expect(buttons.length).toBe(12);
    expect(buttons[0].getAttribute('aria-label')).toBe(`Ver a pantalla completa: ${BOOK_PHOTOS[0].alt}`);
    expect(host.querySelector('app-photo-viewer')).toBeNull();
  });

  it('pulsar un fotograma abre el visor en esa foto y, al cerrar, el foco vuelve al fotograma visto', async () => {
    document.body.appendChild(host);
    const buttons = () => host.querySelectorAll<HTMLButtonElement>('button.frame-open');
    buttons()[4].click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(host.querySelector('.viewer-counter')?.textContent?.trim()).toBe('5 / 12');
    (host.querySelector('.viewer-next') as HTMLButtonElement).click();
    fixture.detectChanges();
    (host.querySelector('.viewer-close') as HTMLButtonElement).click();
    // El cierre vuela de vuelta al fotograma (~0,36 s) antes de quitar el visor.
    await new Promise((resolve) => setTimeout(resolve, 700));
    fixture.detectChanges();
    expect(host.querySelector('app-photo-viewer')).toBeNull();
    expect(document.activeElement).toBe(buttons()[5]);
    host.remove();
  });
});
