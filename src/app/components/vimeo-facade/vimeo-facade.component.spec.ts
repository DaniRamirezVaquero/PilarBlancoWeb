import { ApplicationRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VimeoFacadeComponent } from './vimeo-facade.component';

describe('VimeoFacadeComponent', () => {
  let fixture: ComponentFixture<VimeoFacadeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [VimeoFacadeComponent] }).compileComponents();
    fixture = TestBed.createComponent(VimeoFacadeComponent);
    fixture.componentRef.setInput('videoId', '1208363473');
    fixture.componentRef.setInput('hash', '3205afba43');
    fixture.componentRef.setInput('title', 'Reel de prueba');
    fixture.componentRef.setInput('fallbackPoster', 'https://i.vimeocdn.com/video/1-d_1920?region=us');
    fixture.detectChanges();
  });

  it('pinta el póster vivo con srcset y sin iframe al principio', () => {
    // Arrange
    const el: HTMLElement = fixture.nativeElement;
    // Assert
    const img = el.querySelector('img') as HTMLImageElement;
    expect(img.getAttribute('src')).toContain('/api/vimeo-poster?id=1208363473&h=3205afba43&w=1280');
    expect(img.getAttribute('srcset')).toContain('640w');
    expect(el.querySelector('iframe')).toBeNull();
  });

  it('usa el póster guardado y quita el srcset cuando la imagen falla', () => {
    // Arrange
    const img = (fixture.nativeElement as HTMLElement).querySelector('img') as HTMLImageElement;
    // Act
    img.dispatchEvent(new Event('error'));
    fixture.detectChanges();
    // Assert
    const after = (fixture.nativeElement as HTMLElement).querySelector('img') as HTMLImageElement;
    expect(after.getAttribute('src')).toBe('https://i.vimeocdn.com/video/1-d_1920?region=us');
    expect(after.hasAttribute('srcset')).toBeFalse();
  });

  it('crea el iframe con hash y autoplay solo al pulsar', () => {
    // Arrange
    const el: HTMLElement = fixture.nativeElement;
    // Act
    (el.querySelector('button') as HTMLButtonElement).click();
    fixture.detectChanges();
    // Assert
    const iframe = el.querySelector('iframe') as HTMLIFrameElement;
    expect(iframe.getAttribute('src')).toBe('https://player.vimeo.com/video/1208363473?h=3205afba43&autoplay=1');
  });

  it('lleva el foco al iframe tras pulsar el póster, en vez de dejarlo en el body', () => {
    // Arrange
    const el: HTMLElement = fixture.nativeElement;
    (el.querySelector('button') as HTMLButtonElement).focus();
    // Act
    (el.querySelector('button') as HTMLButtonElement).click();
    fixture.detectChanges();
    TestBed.inject(ApplicationRef).tick();
    // Assert
    const iframe = el.querySelector('iframe') as HTMLIFrameElement;
    expect(iframe.getAttribute('tabindex')).toBe('-1');
    expect(document.activeElement).toBe(iframe);
  });
});
