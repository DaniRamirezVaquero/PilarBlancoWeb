import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CarouselComponent } from './carousel.component';

describe('CarouselComponent', () => {
  let fixture: ComponentFixture<CarouselComponent>;
  let component: CarouselComponent;

  /** Simula la preferencia de movimiento del sistema antes de crear el componente. */
  const create = (reduced: boolean) => {
    spyOn(window, 'matchMedia').and.callFake(
      (query: string) => ({ matches: reduced && query.includes('prefers-reduced-motion') }) as MediaQueryList,
    );
    fixture = TestBed.createComponent(CarouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [CarouselComponent] }).compileComponents();
  });

  afterEach(() => fixture.destroy());

  it('arranca el autoplay sin preferencia de movimiento reducido', () => {
    create(false);
    expect(component.isPlaying).toBeTrue();
    expect(component.autoplayInterval).not.toBeNull();
  });

  it('no arranca el autoplay con movimiento reducido y deja el botón en «Reproducir»', () => {
    create(true);
    const play = (fixture.nativeElement as HTMLElement).querySelectorAll('.carousel-btn')[1];
    expect(component.isPlaying).toBeFalse();
    expect(component.autoplayInterval).toBeNull();
    expect(play.getAttribute('aria-label')).toBe('Reproducir book fotográfico');
  });

  it('no reactiva el autoplay tras interactuar si hay movimiento reducido', () => {
    jasmine.clock().install();
    try {
      create(true);
      component.next();
      jasmine.clock().tick(10_001);
      expect(component.autoplayInterval).toBeNull();
    } finally {
      jasmine.clock().uninstall();
    }
  });

  it('expone la semántica de carrusel y oculta las fotos que no se ven', () => {
    create(false);
    const el: HTMLElement = fixture.nativeElement;
    const region = el.querySelector('[role="region"]') as HTMLElement;
    expect(region.getAttribute('aria-roledescription')).toBe('carrusel');
    const slides = Array.from(el.querySelectorAll('[aria-hidden]')).filter((n) => n.querySelector('img'));
    // 12 fotos + 2 clones: solo la actual queda expuesta.
    expect(slides.length).toBe(13);
  });
});
