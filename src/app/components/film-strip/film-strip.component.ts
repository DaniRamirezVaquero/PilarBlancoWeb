import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Video } from '../../data/portfolio.data';
import { posterUrl } from '../../utils/vimeo-thumbnail';
import { slugify } from '../../utils/slug';

/**
 * Tira de película horizontal con las escenas: cada fotograma abre su escena en /video (?escena=slug). Negro con
 * perforaciones estáticas; en pantallas estrechas se desplaza con scroll-snap.
 */
@Component({
  selector: 'app-film-strip',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './film-strip.component.html',
  styleUrl: './film-strip.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilmStripComponent {
  readonly scenes = input.required<readonly Video[]>();

  /** Miniaturas cuyo póster vivo falló: usan el guardado. */
  private readonly failedThumbs = signal<ReadonlySet<string>>(new Set());

  /** Slug de la escena: /video?escena=slug la pone en la pantalla. */
  sceneSlug(scene: Video): string {
    return slugify(scene.label);
  }

  /** Miniatura viva de una escena; si falla, el póster guardado. */
  sceneThumb(scene: Video): string {
    return this.failedThumbs().has(scene.videoId) ? scene.fallbackPoster : posterUrl(scene.videoId, scene.hash, 640);
  }

  onSceneThumbError(scene: Video): void {
    this.failedThumbs.update((set) => new Set(set).add(scene.videoId));
  }
}
