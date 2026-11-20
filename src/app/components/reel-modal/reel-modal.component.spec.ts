import { ApplicationRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReelModalComponent } from './reel-modal.component';
import { REEL } from '../../data/portfolio.data';

describe('ReelModalComponent', () => {
  let fixture: ComponentFixture<ReelModalComponent>;
  let host: HTMLElement;
  let closes: number;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [ReelModalComponent] }).compileComponents();
    fixture = TestBed.createComponent(ReelModalComponent);
    host = fixture.nativeElement as HTMLElement;
    document.body.appendChild(host);
    closes = 0;
    fixture.componentInstance.closed.subscribe(() => closes++);
    fixture.detectChanges();
    TestBed.inject(ApplicationRef).tick();
  });

  afterEach(() => {
    fixture.destroy();
    host.remove();
    document.documentElement.style.overflow = '';
  });

  const closeButton = () => host.querySelector('button') as HTMLButtonElement;

  it('al abrirse pone el foco en la X y bloquea el scroll en html', () => {
    expect(document.activeElement).toBe(closeButton());
    expect(document.documentElement.style.overflow).toBe('hidden');
  });

  it('es un diálogo modal con el reel de Vimeo', () => {
    const dialog = host.querySelector('[role="dialog"]') as HTMLElement;
    expect(dialog.getAttribute('aria-modal')).toBe('true');
    const iframe = host.querySelector('iframe') as HTMLIFrameElement;
    expect(iframe.getAttribute('src')).toBe(`https://player.vimeo.com/video/${REEL.videoId}?h=${REEL.hash}`);
    expect(iframe.getAttribute('title')).toBe(REEL.title);
  });

  it('Esc y la X piden cerrar', () => {
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    closeButton().click();
    expect(closes).toBe(2);
  });

  it('otras teclas no cierran', () => {
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    expect(closes).toBe(0);
  });

  it('Tab desde el último elemento vuelve al primero y Mayús+Tab desde el primero va al último', () => {
    const iframe = host.querySelector('iframe') as HTMLIFrameElement;
    iframe.focus();
    const tab = new KeyboardEvent('keydown', { key: 'Tab', cancelable: true });
    document.dispatchEvent(tab);
    expect(tab.defaultPrevented).toBeTrue();
    expect(document.activeElement).toBe(closeButton());

    const back = new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, cancelable: true });
    document.dispatchEvent(back);
    expect(back.defaultPrevented).toBeTrue();
    expect(document.activeElement).toBe(iframe);
  });

  it('Tab entre elementos del diálogo no se intercepta', () => {
    const tab = new KeyboardEvent('keydown', { key: 'Tab', cancelable: true });
    document.dispatchEvent(tab);
    expect(tab.defaultPrevented).toBeFalse();
  });

  it('si el foco cae fuera del diálogo, vuelve a la X', () => {
    const outside = document.createElement('button');
    document.body.appendChild(outside);
    outside.focus();
    expect(document.activeElement).toBe(closeButton());
    outside.remove();
  });

  it('usa la sala de la home: .house-lights y sin desenfoque', () => {
    const dialog = host.querySelector('[role="dialog"]') as HTMLElement;
    expect(dialog.classList).toContain('lights-down');
    expect(dialog.querySelector(':scope > .house-lights')).not.toBeNull();
    expect(getComputedStyle(dialog).backdropFilter).toBe('none');
  });

  it('al destruirse restaura el scroll y deja de escuchar el teclado', () => {
    fixture.destroy();
    expect(document.documentElement.style.overflow).toBe('');
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(closes).toBe(0);
  });
});
