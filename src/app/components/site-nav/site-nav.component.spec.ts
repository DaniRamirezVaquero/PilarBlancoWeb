import { ApplicationRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { SiteNavComponent } from './site-nav.component';

describe('SiteNavComponent', () => {
  let fixture: ComponentFixture<SiteNavComponent>;
  let el: HTMLElement;

  const menuButton = () => el.querySelector('.site-nav-menu-btn') as HTMLButtonElement;
  const panel = () => el.querySelector('.menu-panel') as HTMLElement | null;
  const closeButton = () => el.querySelector('.menu-close') as HTMLButtonElement | null;
  /** Fuerza el ciclo completo (incluidos los afterNextRender) tras cada acción. */
  const settle = () => {
    fixture.detectChanges();
    TestBed.inject(ApplicationRef).tick();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SiteNavComponent],
      providers: [provideRouter([{ path: 'curriculum', children: [] }, { path: 'home', children: [] }])],
    }).compileComponents();
    fixture = TestBed.createComponent(SiteNavComponent);
    el = fixture.nativeElement;
    settle();
  });

  afterEach(() => {
    fixture.destroy();
    document.body.style.overflow = '';
  });

  it('abre el menú: aria-expanded, scroll del body bloqueado y foco en «Cerrar»', () => {
    menuButton().click();
    settle();
    expect(menuButton().getAttribute('aria-expanded')).toBe('true');
    expect(panel()).not.toBeNull();
    expect(document.body.style.overflow).toBe('hidden');
    expect(document.activeElement).toBe(closeButton());
  });

  it('la «X» cierra el menú, libera el scroll y devuelve el foco al botón «Menú»', () => {
    menuButton().click();
    settle();
    closeButton()!.click();
    settle();
    expect(panel()).toBeNull();
    expect(menuButton().getAttribute('aria-expanded')).toBe('false');
    expect(document.body.style.overflow).toBe('');
    expect(document.activeElement).toBe(menuButton());
  });

  it('Esc cierra el menú y devuelve el foco al botón', () => {
    menuButton().click();
    settle();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    settle();
    expect(panel()).toBeNull();
    expect(document.body.style.overflow).toBe('');
    expect(document.activeElement).toBe(menuButton());
  });

  it('atrapa el foco: Tab en el último elemento vuelve al primero y Mayús+Tab al revés', () => {
    menuButton().click();
    settle();
    const items = Array.from(panel()!.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'));
    const first = items[0];
    const last = items[items.length - 1];

    last.focus();
    const forward = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true });
    last.dispatchEvent(forward);
    expect(forward.defaultPrevented).toBeTrue();
    expect(document.activeElement).toBe(first);

    const back = new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, bubbles: true, cancelable: true });
    first.dispatchEvent(back);
    expect(back.defaultPrevented).toBeTrue();
    expect(document.activeElement).toBe(last);
  });

  it('elegir una ancla en la home cierra el menú y libera el scroll antes de desplazar', () => {
    const target = document.createElement('section');
    target.id = 'voz';
    document.body.appendChild(target);
    spyOn(target, 'scrollIntoView').and.callFake(() => {
      // Al desplazar, el body ya no debe estar bloqueado o el scroll no se vería.
      expect(document.body.style.overflow).toBe('');
    });
    // La barra considera que está en la home cuando la URL es «/» (estado inicial).
    menuButton().click();
    settle();
    (panel()!.querySelector('a[href="/home#voz"]') as HTMLAnchorElement).click();
    settle();
    expect(target.scrollIntoView).toHaveBeenCalled();
    expect(panel()).toBeNull();
    target.remove();
  });

  it('«CV» solo se marca con aria-current="page" en /curriculum', async () => {
    const cv = () => el.querySelector('a[data-route="curriculum"]') as HTMLAnchorElement;
    expect(cv().getAttribute('aria-current')).toBeNull();

    await TestBed.inject(Router).navigateByUrl('/curriculum');
    settle();
    expect(cv().getAttribute('aria-current')).toBe('page');
    expect(cv().classList).toContain('is-active');

    await TestBed.inject(Router).navigateByUrl('/home');
    settle();
    expect(cv().getAttribute('aria-current')).toBeNull();
  });

  it('el menú móvil también marca «CV» como página actual', async () => {
    await TestBed.inject(Router).navigateByUrl('/curriculum');
    menuButton().click();
    settle();
    const links = Array.from(panel()!.querySelectorAll<HTMLAnchorElement>('.menu-link'));
    const cv = links.find((a) => a.textContent?.trim() === 'CV')!;
    expect(cv.getAttribute('aria-current')).toBe('page');
  });
});
