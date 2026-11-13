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
