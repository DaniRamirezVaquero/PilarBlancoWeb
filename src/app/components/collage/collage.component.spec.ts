import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CollageComponent, captionOf } from './collage.component';

describe('captionOf', () => {
  it('sustituye el guion bajo por un separador legible', () => {
    expect(captionOf('POR LAS NUBES_FERNANDO COLOMO')).toBe('POR LAS NUBES · FERNANDO COLOMO');
  });

  it('deja intacto un título sin guion bajo', () => {
    expect(captionOf('EL DON')).toBe('EL DON');
  });
});

describe('CollageComponent', () => {
  let fixture: ComponentFixture<CollageComponent>;
  let el: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [CollageComponent] }).compileComponents();
    fixture = TestBed.createComponent(CollageComponent);
    fixture.detectChanges();
    el = fixture.nativeElement;
  });

  it('pinta las 35 fotos, cada una con su título visible', () => {
    const figures = Array.from(el.querySelectorAll('figure'));
    expect(figures.length).toBe(35);
    for (const figure of figures) {
      expect(figure.querySelector('figcaption')?.textContent?.trim()).toBeTruthy();
    }
  });

  it('usa las medidas reales de cada foto en vez de un 600x800 fijo', () => {
    const sizes = new Set(Array.from(el.querySelectorAll('img')).map((i) => `${i.getAttribute('width')}x${i.getAttribute('height')}`));
    expect(sizes.has('600x800')).toBeFalse();
    expect(sizes.size).toBeGreaterThan(10);
  });

  it('reparte las fotos en dos columnas desde móvil', () => {
    const column = el.querySelector('.flex-wrap > div') as HTMLElement;
    expect(column.classList).toContain('flex-[50%]');
  });
});
