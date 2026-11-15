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

  it('no tiene nada interactivo: solo se mira', () => {
    expect(host.querySelectorAll('a, button, [tabindex]').length).toBe(0);
  });
});
