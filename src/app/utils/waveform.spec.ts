import { layoutBars, resampleBars } from './waveform';

describe('resampleBars', () => {
  it('reduce tomando el máximo de cada tramo', () => {
    // Arrange
    const peaks = [10, 20, 30, 40];
    // Act
    const bars = resampleBars(peaks, 2);
    // Assert
    expect(bars).toEqual([20, 40]);
  });

  it('reduce 96 picos a 48 barras con el máximo de cada pareja', () => {
    const peaks = Array.from({ length: 96 }, (_, i) => i);
    const bars = resampleBars(peaks, 48);
    expect(bars.length).toBe(48);
    bars.forEach((bar, j) => expect(bar).toBe(j * 2 + 1));
  });

  it('amplía interpolando de forma monótona entre 0 y 100', () => {
    const bars = resampleBars([0, 100], 4);
    expect(bars.length).toBe(4);
    for (let i = 1; i < bars.length; i++) {
      expect(bars[i]).toBeGreaterThanOrEqual(bars[i - 1]);
    }
    expect(bars[0]).toBeGreaterThanOrEqual(0);
    expect(bars[3]).toBeLessThanOrEqual(100);
  });

  it('con tantas barras como picos devuelve los mismos picos', () => {
    const peaks = [5, 80, 33, 0, 100];
    expect(resampleBars(peaks, peaks.length)).toEqual(peaks);
  });

  it('sin picos devuelve ceros y no NaN', () => {
    expect(resampleBars([], 10)).toEqual(new Array(10).fill(0));
  });

  it('con 0 barras devuelve un array vacío', () => {
    expect(resampleBars([1, 2, 3], 0)).toEqual([]);
  });
});

describe('layoutBars', () => {
  const VOICE_LAYOUT = { pitch: 6, width: 2, minBars: 24, heightRatio: 0.9 };
  const peaks96 = Array.from({ length: 96 }, (_, i) => i % 100);

  it('pone una barra cada ~pitch px (escala 1:1)', () => {
    expect(layoutBars(peaks96, 600, 50, VOICE_LAYOUT).length).toBe(100);
  });

  it('respeta el mínimo de barras en cajas estrechas', () => {
    expect(layoutBars(peaks96, 60, 50, VOICE_LAYOUT).length).toBe(24);
  });

  it('centra cada barra en su hueco', () => {
    const bars = layoutBars(peaks96, 600, 50, VOICE_LAYOUT);
    expect(bars[0].x).toBe(2);
    expect(bars[1].x).toBe(8);
  });

  it('aplica la altura mínima y la proporción máxima', () => {
    const bars = layoutBars([0, 100], 12, 50, { ...VOICE_LAYOUT, minBars: 2 });
    expect(bars[0].h).toBe(2);
    expect(bars[1].h).toBeCloseTo(45, 6);
  });

  it('usa la altura mínima indicada', () => {
    const bars = layoutBars([0], 48, 50, { ...VOICE_LAYOUT, minBars: 1, minHeight: 4 });
    expect(bars[0].h).toBe(4);
  });

  it('no da NaN con ancho 0 ni sin picos', () => {
    const finite = (bars: { x: number; h: number }[]) => bars.every((b) => Number.isFinite(b.x) && Number.isFinite(b.h));
    expect(finite(layoutBars(peaks96, 0, 50, VOICE_LAYOUT))).toBeTrue();
    expect(finite(layoutBars([], 600, 50, VOICE_LAYOUT))).toBeTrue();
    expect(layoutBars([], 600, 50, VOICE_LAYOUT).length).toBe(100);
  });
});
