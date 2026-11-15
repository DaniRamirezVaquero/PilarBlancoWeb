/**
 * Reparte los picos en `count` barras: con menos barras que picos, cada barra toma el mayor
 * de su tramo (misma forma, menos densa); con más, se interpola entre picos vecinos.
 * Sin picos o sin barras devuelve ceros o un array vacío, nunca NaN.
 */
export function resampleBars(peaks: readonly number[], count: number): number[] {
  const total = Math.max(0, Math.floor(count));
  if (peaks.length === 0) {
    return new Array<number>(total).fill(0);
  }
  const step = peaks.length / total;
  return Array.from({ length: total }, (_, j) => {
    const from = j * step;
    if (step >= 1) {
      return Math.max(...peaks.slice(Math.floor(from), Math.ceil(from + step)));
    }
    const at = Math.max(0, from + step / 2 - 0.5);
    const i = Math.floor(at);
    const next = peaks[Math.min(peaks.length - 1, i + 1)];
    return peaks[i] + (next - peaks[i]) * (at - i);
  });
}

/** Barra de una onda, en píxeles del viewBox: posición horizontal y altura. */
export interface Bar {
  x: number;
  h: number;
}

/** Geometría de una onda a escala 1:1. */
export interface BarLayout {
  /** Separación aproximada entre barras, en px. */
  pitch: number;
  /** Ancho de cada barra, en px. */
  width: number;
  /** Número mínimo de barras, aunque la caja sea estrecha. */
  minBars: number;
  /** Fracción del alto de la caja que ocupa el pico más alto. */
  heightRatio: number;
  /** Altura mínima de una barra, en px (2 por defecto). */
  minHeight?: number;
}

/**
 * Barras a escala 1:1 en una caja de w×h px: una cada ~`pitch` px, centradas en su hueco y sin tope
 * de número. La comparten la lista de demos y la onda de fondo «en el aire». Con w ≤ 0 no da NaN.
 */
export function layoutBars(peaks: readonly number[], w: number, h: number, o: BarLayout): Bar[] {
  const width = Math.max(0, w);
  const count = Math.max(o.minBars, Math.floor(width / o.pitch));
  const slot = count > 0 ? width / count : 0;
  const minH = o.minHeight ?? 2;
  return resampleBars(peaks, count).map((peak, j) => ({
    x: j * slot + (slot - o.width) / 2,
    h: Math.max(minH, (peak / 100) * Math.max(0, h) * o.heightRatio),
  }));
}
