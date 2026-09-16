import { Component, Input, inject, signal } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { IconComponent } from '../icon/icon.component';

/**
 * Facade ligero para vídeos de Vimeo: solo pinta un póster estático (miniatura)
 * y un botón de play. El <iframe> del reproductor (y todo su JS/cookies de
 * terceros) no se crea hasta que el usuario hace clic, evitando cargar
 * varios players Vimeo a la vez en /video y /voice.
 */
@Component({
  selector: 'app-vimeo-facade',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './vimeo-facade.component.html',
  styleUrl: './vimeo-facade.component.css'
})
export class VimeoFacadeComponent {
  @Input({ required: true }) videoId!: string;
  @Input({ required: true }) hash!: string;
  @Input({ required: true }) title!: string;
  /**
   * URL directa a la CDN de Vimeo (i.vimeocdn.com) en alta resolución, obtenida
   * de la API oEmbed de cada vídeo (ver comentarios donde se usa el componente).
   * vumbnail.com (usado antes) limita todas las miniaturas a 640×360, lo que se
   * veía pixelado al estirarlo a pantalla completa.
   */
  @Input({ required: true }) poster!: string;
  /** Marca el póster como recurso prioritario cuando el vídeo es el principal de la página. */
  @Input() priority = false;

  private readonly sanitizer = inject(DomSanitizer);

  readonly loaded = signal(false);
  safeUrl: SafeResourceUrl | null = null;

  load(): void {
    if (this.loaded()) {
      return;
    }
    const url = `https://player.vimeo.com/video/${this.videoId}?h=${this.hash}&autoplay=1`;
    this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    this.loaded.set(true);
  }
}
