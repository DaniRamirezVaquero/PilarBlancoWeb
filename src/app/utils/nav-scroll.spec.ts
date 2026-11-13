import { centeredScrollLeft, scrollBehaviorFor, sectionForPage } from './nav-scroll';

describe('centeredScrollLeft', () => {
  it('centra el enlace cuando está fuera de la vista', () => {
    // Arrange / Act
    const left = centeredScrollLeft(390, 800, 361, 111);
    // Assert: 361 + 55.5 - 195 = 221.5
    expect(left).toBe(221.5);
  });

  it('no baja de 0 ni pasa del recorrido máximo', () => {
    expect(centeredScrollLeft(390, 600, 0, 50)).toBe(0);
    expect(centeredScrollLeft(390, 600, 550, 50)).toBe(210);
  });

  it('devuelve 0 si la fila no desborda', () => {
    expect(centeredScrollLeft(500, 400, 300, 80)).toBe(0);
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
