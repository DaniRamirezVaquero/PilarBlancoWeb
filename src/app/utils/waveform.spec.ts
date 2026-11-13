import { resampleBars } from './waveform';

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
