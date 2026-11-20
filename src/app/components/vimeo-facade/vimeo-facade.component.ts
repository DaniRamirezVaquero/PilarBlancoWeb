import { Component, ElementRef, Injector, Input, OnInit, afterNextRender, inject, signal, viewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { IconComponent } from '../icon/icon.component';
import { posterSrcset, posterUrl } from '../../utils/vimeo-thumbnail';

/**
 * Facade ligero para vídeos de Vimeo: solo pinta un póster estático (miniatura)
 * y un botón de play. El <iframe> del reproductor (y todo su JS/cookies de
 * terceros) no se crea hasta que el usuario hace clic, evitando cargar
 * varios players Vimeo a la vez en /video y /voice.
 *
 * El póster se resuelve en vivo con /api/vimeo-poster (redirige a la carátula
 * actual de Vimeo, cacheada en la CDN de Vercel). Si falla (dev local sin /api
 * o Vimeo caído) se usa `fallbackPoster`.
 */
@Component({
  selector: 'app-vimeo-facade',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './vimeo-facade.component.html',
  styleUrl: './vimeo-facade.component.css'
})
export class VimeoFacadeComponent implements OnInit {
  @Input({ required: true }) videoId!: string;
  @Input({ required: true }) hash!: string;
  @Input({ required: true }) title!: string;
  /** Póster guardado (CDN de Vimeo, ~1920px): solo respaldo si /api/vimeo-poster falla. */
  @Input({ required: true }) fallbackPoster!: string;
  /** Marca el póster como recurso prioritario cuando el vídeo es el principal de la página. */
  @Input() priority = false;
  /** Ancho que ocupa el póster, para que el navegador elija el candidato del srcset. */
  @Input() sizes = '(min-width: 1024px) 50vw, 100vw';
  /** Crea el reproductor al nacer: solo cuando lo pide un clic (un cartel de /video). */
  @Input() startLoaded = false;

  private readonly sanitizer = inject(DomSanitizer);
  private readonly injector = inject(Injector);
  /** El iframe del reproductor, una vez creado (la página lo usa para escuchar sus eventos). */
  readonly frame = viewChild<ElementRef<HTMLIFrameElement>>('frame');

  readonly loaded = signal(false);
  readonly posterFailed = signal(false);
  safeUrl: SafeResourceUrl | null = null;

  get src(): string {
    return this.posterFailed() ? this.fallbackPoster : posterUrl(this.videoId, this.hash, 1280);
  }

  get srcset(): string | null {
    return this.posterFailed() ? null : posterSrcset(this.videoId, this.hash);
  }

  ngOnInit(): void {
    if (this.startLoaded) {
      this.load();
    }
  }

  load(): void {
    if (this.loaded()) {
      return;
    }
    const url = `https://player.vimeo.com/video/${this.videoId}?h=${this.hash}&autoplay=1`;
    this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    this.loaded.set(true);
    // El botón se destruye al cargar: sin esto el foco caería en <body>. Sin scroll: lo decide la página.
    afterNextRender(() => this.frame()?.nativeElement.focus({ preventScroll: true }), { injector: this.injector });
  }
}
