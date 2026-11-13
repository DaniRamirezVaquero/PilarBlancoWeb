import { Component, inject, OnDestroy, AfterViewInit, ElementRef, NgZone, PLATFORM_ID, signal, viewChild } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PlayBtnComponent } from '../../components/play-btn/play-btn.component';
import { VimeoFacadeComponent } from '../../components/vimeo-facade/vimeo-facade.component';
import { VoiceStripComponent } from '../../components/voice-strip/voice-strip.component';
import { CarouselComponent } from '../../components/carousel/carousel.component';
import { IconComponent } from '../../components/icon/icon.component';
import { CONTACT, HIGHLIGHT_CREDITS, REEL, SCENES, VOICE, Video } from '../../data/portfolio.data';
import { posterUrl } from '../../utils/vimeo-thumbnail';
import { slugify } from '../../utils/slug';
import { NavService } from '../../services/nav.service';
import { HeroCover, HeroThemeService } from '../../services/hero-theme.service';
import { CommonModule } from '@angular/common';

/** Ids de las secciones con scroll de la home, en orden de aparición. */
const SECTION_IDS = ['reel', 'fotos', 'voz', 'trayectoria', 'contacto'] as const;

@Component({
    selector: 'app-principal',
    imports: [
        PlayBtnComponent,
        CommonModule,
        RouterLink,
        VimeoFacadeComponent,
        VoiceStripComponent,
        CarouselComponent,
        IconComponent
    ],
    templateUrl: './principal.component.html',
    styleUrl: './principal.component.css'
})
export class PrincipalComponent implements AfterViewInit, OnDestroy {

  showReel: boolean = false;

  readonly heroTheme = inject(HeroThemeService);
  readonly heroWidths: readonly number[] = [960, 1920, 3200];
  /** Cubierta del hero ya cargada. Es signal: se fija en ngAfterViewInit y así no dispara NG0100 en desarrollo. */
  readonly readyCover = signal<HeroCover | null>(null);

  // Material de las secciones con scroll
  readonly voice = VOICE;
  readonly credits = HIGHLIGHT_CREDITS;
  readonly reel = REEL;
  readonly scenes = SCENES;
  readonly email = CONTACT.email;
  /** Usuario y dominio por separado: en móvil la dirección parte justo antes de la arroba. */
  readonly emailUser = CONTACT.email.slice(0, CONTACT.email.indexOf('@'));
  readonly emailDomain = CONTACT.email.slice(CONTACT.email.indexOf('@'));
  readonly mailtoUrl = `mailto:${CONTACT.email}`;
  readonly gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(CONTACT.email)}`;
  readonly instagram = CONTACT.instagram;
  readonly vimeo = CONTACT.vimeo;
  readonly cvUrl = CONTACT.cv;
  readonly photosZip = CONTACT.photosZip;

  /** Miniaturas de «Más escenas» cuyo póster vivo falló: usan el guardado. */
  private readonly failedThumbs = signal<ReadonlySet<string>>(new Set());

  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly document = inject(DOCUMENT);
  private readonly carousel = viewChild(CarouselComponent);
  private sectionObserver: IntersectionObserver | null = null;
  private carouselObserver: IntersectionObserver | null = null;

  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly zone = inject(NgZone);
  private readonly navService = inject(NavService);
  private heroObserver: IntersectionObserver | null = null;
  private heroEl: HTMLElement | null = null;
  private nameEl: HTMLElement | null = null;
  private readonly heroListeners: [string, EventListener][] = [
    ['mousemove', (event) => this.onMouseMove(event as MouseEvent)],
    ['mouseleave', () => this.onMouseLeave()],
  ];

  ngAfterViewInit(): void {
    this.revealIfCached();
    if (!this.isBrowser) {
      return;
    }
    this.bindHeroPointer();
    if (typeof IntersectionObserver !== 'undefined') {
      this.observeHero();
      this.observeSections();
      this.pauseCarouselOffscreen();
    }
  }

  ngOnDestroy(): void {
    this.sectionObserver?.disconnect();
    this.carouselObserver?.disconnect();
    this.heroObserver?.disconnect();
    for (const [type, listener] of this.heroListeners) {
      this.heroEl?.removeEventListener(type, listener);
    }
    this.navService.activeSection.set(null);
    this.navService.heroPassed.set(false);
    this.setBodyScrollLocked(false);
    this.document.removeEventListener('keydown', this.onEscape);
  }

  /** La barra superior pasa de transparente a cristal cuando el hero sale de la pantalla. */
  private observeHero(): void {
    const hero = this.heroEl;
    if (!hero) {
      return;
    }
    this.heroObserver = new IntersectionObserver(([entry]) => {
      this.navService.heroPassed.set(!entry.isIntersecting);
    }, { rootMargin: '-72px 0px 0px 0px' });
    this.heroObserver.observe(hero);
  }

  /** El efecto 3D del nombre escucha solo sobre el hero y fuera de la zona de Angular. */
  private bindHeroPointer(): void {
    const root = this.elementRef.nativeElement;
    this.heroEl = root.querySelector('.hero-container');
    this.nameEl = root.querySelector('.interactive-name');
    this.zone.runOutsideAngular(() => {
      for (const [type, listener] of this.heroListeners) {
        this.heroEl?.addEventListener(type, listener, { passive: true });
      }
    });
  }

  /** Título sin su última palabra: la última va unida al icono de enlace para que nunca quede sola. */
  titleHead(title: string): string {
    const cut = title.lastIndexOf(' ');
    return cut < 0 ? '' : title.slice(0, cut + 1);
  }

  titleTail(title: string): string {
    return title.slice(title.lastIndexOf(' ') + 1);
  }

  /** Ancla de la escena en /video. */
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

  /** Publica la sección visible para marcarla en la barra superior. */
  private observeSections(): void {
    const visible = new Set<string>();
    this.sectionObserver = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          visible.add(entry.target.id);
        } else {
          visible.delete(entry.target.id);
        }
      }
      const current = SECTION_IDS.find((id) => visible.has(id)) ?? null;
      this.navService.activeSection.set(current);
    }, { rootMargin: '-35% 0px -55% 0px' });
    for (const id of SECTION_IDS) {
      const el = this.document.getElementById(id);
      if (el) {
        this.sectionObserver.observe(el);
      }
    }
  }

  /** El carrusel solo avanza solo mientras se ve: así no trabaja desde la carga de la home. */
  private pauseCarouselOffscreen(): void {
    const carousel = this.carousel();
    const host = this.elementRef.nativeElement.querySelector('app-carousel');
    if (!carousel || !host) {
      return;
    }
    // El observer avisa nada más observar: si no se ve, para el autoplay que arrancó el carrusel.
    this.carouselObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        carousel.startAutoplay();
      } else {
        carousel.stopAutoplay();
      }
    });
    this.carouselObserver.observe(host);
  }

  private setBodyScrollLocked(locked: boolean): void {
    if (this.isBrowser) {
      this.document.body.style.overflow = locked ? 'hidden' : '';
    }
  }

  onCoverLoad(cover: HeroCover): void {
    if (cover === this.heroTheme.currentCover()) {
      this.readyCover.set(cover);
    }
  }

  /** Devuelve el srcset responsivo (960/1920/3200w) para una cubierta del hero. */
  coverSrcset(key: string): string {
    return this.heroWidths
      .map(width => `assets/images/hero/${key}-${width}.webp ${width}w`)
      .join(', ');
  }

  /** Fallback para navegadores sin soporte de srcset. */
  coverSrc(key: string): string {
    return `assets/images/hero/${key}-1920.webp`;
  }

  private revealIfCached(): void {
    const img = this.elementRef.nativeElement.querySelector<HTMLImageElement>('img.hero-cover');
    const cover = this.heroTheme.currentCover();
    const src = img?.currentSrc || img?.src || '';
    if (img?.complete && img.naturalWidth > 0 && src.includes(cover)) {
      this.readyCover.set(cover);
    }
  }

  toggleShowReel() {
    this.showReel = !this.showReel;
    this.setBodyScrollLocked(this.showReel);
    if (this.showReel) {
      this.document.addEventListener('keydown', this.onEscape);
    } else {
      this.document.removeEventListener('keydown', this.onEscape);
    }
  }

  /** Escape cierra el reel del hero mientras está abierto. */
  private readonly onEscape = (event: KeyboardEvent): void => {
    if (event.key === 'Escape' && this.showReel) {
      this.zone.run(() => this.toggleShowReel());
    }
  };

  private onMouseMove(event: MouseEvent): void {
    const container = this.heroEl;
    const nameElement = this.nameEl;
    if (!container || !nameElement) {
      return;
    }

    // Quitar la clase de retorno para transición rápida durante movimiento
    nameElement.classList.remove('returning');

    const rect = container.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const mouseX = event.clientX - centerX;
    const mouseY = event.clientY - centerY;

    // Rotación 3D de hasta 8 grados
    const rotateX = (mouseY / rect.height) * -15;
    const rotateY = (mouseX / rect.width) * 15;
    nameElement.style.transform = `
      perspective(800px)
      rotateX(${Math.max(-8, Math.min(8, rotateX))}deg)
      rotateY(${Math.max(-8, Math.min(8, rotateY))}deg)
      translateZ(20px)
    `;

    // Posición del gradiente dinámico
    const mousePercentX = ((event.clientX - rect.left) / rect.width) * 100;
    container.style.setProperty('--glow-x', `${mousePercentX - 75}%`);
  }

  private onMouseLeave(): void {
    const nameElement = this.nameEl;
    if (nameElement) {
      nameElement.classList.add('returning');
      nameElement.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateZ(0)';
      nameElement.style.setProperty('--glow-x', '-150%');
    }
  }
}
