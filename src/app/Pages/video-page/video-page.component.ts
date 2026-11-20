import {
  ChangeDetectionStrategy, Component, DestroyRef, ElementRef, Injector, NgZone, afterNextRender, computed, inject,
  signal, viewChild,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { PosterWallComponent } from '../../components/poster-wall/poster-wall.component';
import { VimeoFacadeComponent } from '../../components/vimeo-facade/vimeo-facade.component';
import { REEL, SCENES, Video } from '../../data/portfolio.data';
import { postVimeoPlay, watchVimeoPlayback } from '../../utils/vimeo-player-events';
import { scrollBehaviorFor } from '../../utils/nav-scroll';
import { slugify } from '../../utils/slug';

/** Fracción visible de la pantalla por debajo de la cual se encienden las luces. */
export const SCREEN_VISIBLE_RATIO = 0.35;

/**
 * /video, «Cartelera»: una sola pantalla con bandas y, debajo, la pared de carteles. Elegir un cartel lo
 * proyecta en la pantalla y lo reproduce. Mientras el vídeo suena y la pantalla se ve, la sala se apaga
 * (`.house-lights`, la misma de la home); se enciende al pausar, al terminar o al salir la pantalla de la vista.
 */
@Component({
  selector: 'app-video-page',
  imports: [VimeoFacadeComponent, PosterWallComponent],
  templateUrl: './video-page.component.html',
  styleUrl: './video-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VideoPageComponent {
  readonly reel = REEL;
  /** El reel también es un cartel: así se puede volver a él después de ver una escena. */
  readonly billboard: readonly Video[] = [REEL, ...SCENES];

  /** Vídeo en pantalla. En el prerender, siempre el reel. */
  readonly current = signal<Video>(REEL);
  /** true tras elegir un cartel: los reproductores nuevos nacen sonando (hubo un clic). */
  readonly autoplay = signal(false);
  /** true mientras el reproductor de la pantalla suena (eventos de Vimeo). */
  readonly playing = signal(false);
  /** true mientras se ve al menos SCREEN_VISIBLE_RATIO de la pantalla. Sin IntersectionObserver, siempre. */
  readonly screenInView = signal(true);
  readonly lightsDown = computed(() => this.playing() && this.screenInView());

  private readonly facade = viewChild(VimeoFacadeComponent);
  private readonly screenEl = viewChild.required<ElementRef<HTMLElement>>('screen');
  private readonly route = inject(ActivatedRoute);
  private readonly document = inject(DOCUMENT);
  private readonly zone = inject(NgZone);
  private readonly injector = inject(Injector);

  constructor() {
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      const win = this.document.defaultView;
      if (!win) {
        return;
      }
      this.showRequestedScene();
      const observer = this.observeScreen(win);
      const stop = watchVimeoPlayback(win, () => this.facade()?.frame()?.nativeElement,
        (playing) => this.zone.run(() => this.playing.set(playing)));
      destroyRef.onDestroy(() => {
        stop();
        observer?.disconnect();
      });
    });
  }

  /** Proyecta un cartel: lo carga en la pantalla sonando y sube hasta ella; el foco pasa al reproductor. */
  show(video: Video): void {
    const facade = this.facade();
    if (video.videoId === this.current().videoId && facade) {
      // El mismo vídeo: si aún es el póster, arranca; si ya suena, solo se sube a la pantalla.
      if (!facade.loaded()) {
        facade.load();
      } else {
        // Cargado y quizá en pausa: se reanuda y el foco pasa al reproductor.
        postVimeoPlay(facade.frame()?.nativeElement);
        facade.frame()?.nativeElement.focus({ preventScroll: true });
      }
      this.scrollToScreen();
      return;
    }
    // Otro vídeo: el reproductor anterior se destruye (deja de sonar) y nace uno nuevo con autoplay.
    this.playing.set(false);
    this.autoplay.set(true);
    this.current.set(video);
    afterNextRender(() => this.scrollToScreen(), { injector: this.injector });
  }

  private scrollToScreen(): void {
    this.screenEl().nativeElement.scrollIntoView({
      behavior: scrollBehaviorFor(this.document.defaultView),
      block: 'center',
    });
  }

  /** `/video?escena=slug` (la tira «Más escenas» de la home): esa escena en pantalla, con su póster y sin sonar. */
  private showRequestedScene(): void {
    const slug = this.route.snapshot.queryParamMap.get('escena');
    const scene = slug ? SCENES.find((v) => slugify(v.label) === slug) : undefined;
    if (scene) {
      this.current.set(scene);
    }
  }

  private observeScreen(win: Window): IntersectionObserver | null {
    const IO = (win as Window & { IntersectionObserver?: typeof IntersectionObserver }).IntersectionObserver;
    if (!IO) {
      return null;
    }
    const observer = new IO((entries) => {
      // Si llegan varias entradas juntas, manda la más reciente.
      const entry = entries[entries.length - 1];
      const inView = !!entry && entry.intersectionRatio >= SCREEN_VISIBLE_RATIO;
      this.zone.run(() => this.screenInView.set(inView));
    }, { threshold: [0, SCREEN_VISIBLE_RATIO] });
    observer.observe(this.screenEl().nativeElement);
    return observer;
  }
}
