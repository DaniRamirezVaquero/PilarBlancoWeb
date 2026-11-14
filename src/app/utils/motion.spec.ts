import { prefersReducedMotion } from './motion';

describe('prefersReducedMotion', () => {
  const win = (matches: boolean) => ({ matchMedia: () => ({ matches }) as MediaQueryList });

  it('refleja la preferencia del usuario', () => {
    expect(prefersReducedMotion(win(true))).toBeTrue();
    expect(prefersReducedMotion(win(false))).toBeFalse();
  });

  it('devuelve false sin window (prerender)', () => {
    expect(prefersReducedMotion(null)).toBeFalse();
    expect(prefersReducedMotion(undefined)).toBeFalse();
  });
});
