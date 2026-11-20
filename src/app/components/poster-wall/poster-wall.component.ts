import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { IconComponent } from '../icon/icon.component';
import { Video } from '../../data/portfolio.data';
import { CENTERED, POSTER_FRAMING, PosterFraming } from '../../data/screens.data';
import { posterSrcset, posterUrl } from '../../utils/vimeo-thumbnail';
import { slugify } from '../../utils/slug';

/**
 * «En cartel»: un cartel vertical (2:3) por vídeo, con el recorte del póster vivo centrado en la cara.
 * Pulsar un cartel pide proyectarlo en la pantalla de la página; el que está en pantalla lleva
 * `aria-current`. Cada hueco conserva el ancla con el slug, para los enlaces viejos `/video#slug`.
 */
@Component({
  selector: 'app-poster-wall',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './poster-wall.component.html',
  styleUrl: './poster-wall.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PosterWallComponent {
  readonly videos = input.required<readonly Video[]>();
  /** videoId del vídeo en pantalla. */
  readonly current = input<string | null>(null);
  /** Pide proyectar este vídeo. */
  readonly choose = output<Video>();

  /**
   * Ancho pintado del póster, no el del cartel: con `object-fit: cover`, un póster apaisado dentro de un recorte
   * 2:3 se pinta a lo alto del cartel por su proporción (unas 2,3 veces el ancho del cartel).
   */
  readonly sizes = '(min-width: 1024px) 760px, 560px';

  /** Carteles cuyo póster vivo falló: usan el guardado y sin srcset. */
  readonly failed = signal<ReadonlySet<string>>(new Set());

  slug(video: Video): string {
    return slugify(video.label);
  }

  framing(video: Video): PosterFraming {
    return POSTER_FRAMING[video.videoId] ?? CENTERED;
  }

  src(video: Video): string {
    return this.failed().has(video.videoId) ? video.fallbackPoster : posterUrl(video.videoId, video.hash, 1280);
  }

  srcset(video: Video): string | null {
    return this.failed().has(video.videoId) ? null : posterSrcset(video.videoId, video.hash);
  }

  onError(video: Video): void {
    this.failed.update((set) => new Set(set).add(video.videoId));
  }
}
