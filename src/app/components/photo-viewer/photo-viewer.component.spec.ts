import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PhotoViewerComponent } from './photo-viewer.component';
import { BOOK_PHOTOS } from '../../data/photos.data';

describe('PhotoViewerComponent', () => {
  let fixture: ComponentFixture<PhotoViewerComponent>;
  let component: PhotoViewerComponent;
  let host: HTMLElement;

  const dialog = () => host.querySelector('dialog') as HTMLDialogElement;
  const img = () => host.querySelector('.viewer-img') as HTMLImageElement;
  const counter = () => host.querySelector('.viewer-counter')?.textContent?.trim();
  const key = (k: string) => {
    dialog().dispatchEvent(new KeyboardEvent('keydown', { key: k, cancelable: true }));
    fixture.detectChanges();
  };
  const pointer = (type: string, clientX: number) =>
    new PointerEvent(type, { clientX, isPrimary: true, bubbles: true });

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [PhotoViewerComponent] }).compileComponents();
    fixture = TestBed.createComponent(PhotoViewerComponent);
    component = fixture.componentInstance;
    host = fixture.nativeElement as HTMLElement;
    document.body.appendChild(host);
    fixture.componentRef.setInput('photos', BOOK_PHOTOS);
    fixture.componentRef.setInput('index', 2);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  afterEach(() => {
    fixture.destroy();
    host.remove();
    document.body.style.overflow = '';
  });

  it('se abre como diálogo modal con la foto pulsada, el contador y bloquea el scroll de la página', () => {
    expect(dialog().open).toBeTrue();
    expect(img().getAttribute('alt')).toBe(BOOK_PHOTOS[2].alt);
    expect(counter()).toBe('3 / 12');
    expect(document.body.style.overflow).toBe('hidden');
  });

  it('los botones y las flechas del teclado recorren el book y dan la vuelta', () => {
    (host.querySelector('.viewer-next') as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(counter()).toBe('4 / 12');
    key('ArrowLeft');
    key('ArrowLeft');
    key('ArrowLeft');
    expect(counter()).toBe('1 / 12');
    key('ArrowLeft');
    expect(counter()).toBe('12 / 12');
    key('ArrowRight');
    expect(counter()).toBe('1 / 12');
  });

  it('anuncia la foto actual al lector de pantalla', () => {
    key('ArrowRight');
    expect(host.querySelector('[aria-live="polite"]')?.textContent?.trim())
      .toBe(`Foto 4 de 12: ${BOOK_PHOTOS[3].alt}`);
  });

  it('deslizar a la izquierda pasa a la siguiente; un toque corto no cambia de foto', () => {
    const stage = host.querySelector('.viewer-stage') as HTMLElement;
    stage.dispatchEvent(pointer('pointerdown', 300));
    stage.dispatchEvent(pointer('pointerup', 200));
    fixture.detectChanges();
    expect(component.index()).toBe(3);
    stage.dispatchEvent(pointer('pointerdown', 200));
    stage.dispatchEvent(pointer('pointerup', 215));
    fixture.detectChanges();
    expect(component.index()).toBe(3);
    stage.dispatchEvent(pointer('pointerdown', 100));
    stage.dispatchEvent(pointer('pointerup', 260));
    fixture.detectChanges();
    expect(component.index()).toBe(2);
  });

  it('la X cierra el diálogo y emite closed', () => {
    const closed = jasmine.createSpy('closed');
    component.closed.subscribe(closed);
    (host.querySelector('.viewer-close') as HTMLButtonElement).click();
    expect(dialog().open).toBeFalse();
    expect(closed).toHaveBeenCalledTimes(1);
  });

  it('pulsar en el papel cierra, pero pulsar en la foto no', () => {
    const closed = jasmine.createSpy('closed');
    component.closed.subscribe(closed);
    img().click();
    expect(closed).not.toHaveBeenCalled();
    (host.querySelector('.viewer-stage') as HTMLElement).click();
    expect(closed).toHaveBeenCalledTimes(1);
  });

  it('al destruirse devuelve el scroll de la página', () => {
    fixture.destroy();
    expect(document.body.style.overflow).toBe('');
  });
});
