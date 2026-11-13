import { isHash, isVideoId, posterSrcset, posterUrl, resizeThumbnail, toPosterWidth } from './vimeo-thumbnail';

describe('vimeo-thumbnail', () => {
  describe('resizeThumbnail', () => {
    it('cambia el ancho del sufijo', () => {
      // Arrange
      const url = 'https://i.vimeocdn.com/video/2204158798-abc-d_1280?region=us';
      // Act
      const result = resizeThumbnail(url, 1920);
      // Assert
      expect(result).toBe('https://i.vimeocdn.com/video/2204158798-abc-d_1920?region=us');
    });

    it('sustituye un sufijo con ancho y alto', () => {
      const result = resizeThumbnail('https://i.vimeocdn.com/video/1-abc-d_295x166?region=us', 640);
      expect(result).toBe('https://i.vimeocdn.com/video/1-abc-d_640?region=us');
    });

    it('devuelve null si el host no es la CDN de Vimeo', () => {
      expect(resizeThumbnail('https://evil.com/video/1-d_1280', 1280)).toBeNull();
      expect(resizeThumbnail('https://i.vimeocdn.com.evil.com/video/1-d_1280', 1280)).toBeNull();
    });

    it('devuelve null si no hay sufijo de tamaño', () => {
      expect(resizeThumbnail('https://i.vimeocdn.com/video/1', 1280)).toBeNull();
    });

    it('devuelve null con protocolo no https o con una URL inválida', () => {
      expect(resizeThumbnail('http://i.vimeocdn.com/video/1-d_1280', 1280)).toBeNull();
      expect(resizeThumbnail('no es una url', 1280)).toBeNull();
    });
  });

  describe('validadores', () => {
    it('isVideoId solo acepta ids numéricos', () => {
      expect(isVideoId('1208363473')).toBeTrue();
      expect(isVideoId('abc')).toBeFalse();
      expect(isVideoId('1;rm')).toBeFalse();
      expect(isVideoId(null)).toBeFalse();
    });

    it('isHash solo acepta hexadecimales', () => {
      expect(isHash('3205afba43')).toBeTrue();
      expect(isHash('zzzzzz')).toBeFalse();
      expect(isHash('3205afba43/../')).toBeFalse();
      expect(isHash(null)).toBeFalse();
    });
  });

  describe('toPosterWidth', () => {
    it('acepta los anchos permitidos y usa 1280 en otro caso', () => {
      expect(toPosterWidth('640')).toBe(640);
      expect(toPosterWidth('1920')).toBe(1920);
      expect(toPosterWidth('9999')).toBe(1280);
      expect(toPosterWidth(null)).toBe(1280);
    });
  });

  describe('posterUrl y posterSrcset', () => {
    it('construye la URL relativa del endpoint', () => {
      expect(posterUrl('1208363473', '3205afba43', 640)).toBe('/api/vimeo-poster?id=1208363473&h=3205afba43&w=640');
    });

    it('genera tres candidatos 640w, 1280w y 1920w', () => {
      const candidates = posterSrcset('1208363473', '3205afba43').split(', ');
      expect(candidates.length).toBe(3);
      expect(candidates[0]).toContain(' 640w');
      expect(candidates[1]).toContain(' 1280w');
      expect(candidates[2]).toContain('&w=1920 1920w');
    });
  });
});
