import { slugify } from './slug';

describe('slugify', () => {
  it('quita tildes, pasa a minúsculas y une con guiones', () => {
    expect(slugify('Pecadores de la pradera')).toBe('pecadores-de-la-pradera');
    expect(slugify('Demo de doblaje 1')).toBe('demo-de-doblaje-1');
    expect(slugify('Más allá: ¡Reel! ')).toBe('mas-alla-reel');
  });
});
