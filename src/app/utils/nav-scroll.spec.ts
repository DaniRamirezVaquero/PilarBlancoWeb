import { isRouteActive, scrollBehaviorFor, sectionForPage } from './nav-scroll';

describe('isRouteActive', () => {
  it('marca la ruta exacta, con query o fragmento', () => {
    expect(isRouteActive('/curriculum', '/curriculum')).toBeTrue();
    expect(isRouteActive('/curriculum?x=1#a', '/curriculum')).toBeTrue();
  });

  it('no marca otras rutas ni prefijos parecidos', () => {
    expect(isRouteActive('/home', '/curriculum')).toBeFalse();
    expect(isRouteActive('/curriculum-2', '/curriculum')).toBeFalse();
  });
});

describe('sectionForPage', () => {
  it('marca Voz en /voice y Reel en /video', () => {
    expect(sectionForPage('/voice')).toBe('voz');
    expect(sectionForPage('/video?x=1#escena')).toBe('reel');
  });

  it('no marca nada en otras rutas', () => {
    expect(sectionForPage('/bio')).toBeNull();
    expect(sectionForPage('/home')).toBeNull();
  });
});

describe('scrollBehaviorFor', () => {
  const win = (matches: boolean) => ({ matchMedia: () => ({ matches }) as MediaQueryList });

  it('usa auto con movimiento reducido', () => {
    expect(scrollBehaviorFor(win(true))).toBe('auto');
  });

  it('usa smooth sin esa preferencia o sin window', () => {
    expect(scrollBehaviorFor(win(false))).toBe('smooth');
    expect(scrollBehaviorFor(null)).toBe('smooth');
  });
});
