import {
  Component, inject, OnDestroy, AfterViewInit, ElementRef, NgZone, PLATFORM_ID, computed, signal, viewChild,
} from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PlayBtnComponent } from '../../components/play-btn/play-btn.component';
import { VimeoFacadeComponent } from '../../components/vimeo-facade/vimeo-facade.component';
import { VoiceStripComponent } from '../../components/voice-strip/voice-strip.component';
import { ContactSheetComponent } from '../../components/contact-sheet/contact-sheet.component';
import { OnAirWaveComponent } from '../../components/on-air/on-air-wave.component';
import { OnAirPilotComponent } from '../../components/on-air/on-air-pilot.component';
import { IconComponent } from '../../components/icon/icon.component';
import { CONTACT, HIGHLIGHT_CREDITS, REEL, SCENES, VOICE } from '../../data/portfolio.data';
import { FilmStripComponent } from '../../components/film-strip/film-strip.component';
import { prefersReducedMotion } from '../../utils/motion';
import { NavService } from '../../services/nav.service';
import { HeroCover, HeroThemeService } from '../../services/hero-theme.service';
import { CommonModule } from '@angular/common';

/** Ids de las secciones con scroll de la home, en orden de aparición. */
const SECTION_IDS = ['reel', 'fotos', 'voz', 'trayectoria', 'contacto'] as const;
/** Fracción visible a partir de la cual la última sección cuenta como «vista entera». */
const LAST_SECTION_RATIO = 0.9;
/** Si al hidratar el reel empieza por debajo de esta fracción del viewport, su entrada se arma (aún no se ve). */
const REEL_ARM_RATIO = 0.45;
/** Fracción visible del reel que dispara su entrada. */
const REEL_SHOW_RATIO = 0.15;

@Component({
    selector: 'app-principal',
    imports: [
        PlayBtnComponent,
        CommonModule,
        RouterLink,
        VimeoFacadeComponent,
        VoiceStripComponent,
        ContactSheetComponent,
        FilmStripComponent,
        OnAirWaveComponent,
        OnAirPilotComponent,
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

  /**
   * «Se apagan las luces»: la sala se oscurece mientras el reel es la sección activa de la barra. También con
   * movimiento reducido: entonces el CSS quita la transición y el oscurecimiento es instantáneo.
   */
  readonly lightsDown = computed(() => this.navService.activeSection() === 'reel');
  /**
   * Estado previo a la entrada del reel (rótulo, bandas y tira ocultos). Solo lo pone el JS en el
   * navegador y sin movimiento reducido: el prerender, la hidratación y el modo sin JS ven el estado final.
   */
  readonly reelArmed = signal(false);
  /** Se queda en true la primera vez que el reel entra en pantalla o recibe el foco: la entrada ocurre una vez. */
  readonly reelShown = signal(false);
  /** Lo armado y aún no mostrado: está oculto y no debe recibir el foco. */
  readonly reelHidden = computed(() => this.reelArmed() && !this.reelShown());

  private readonly strip = viewChild(VoiceStripComponent);
  /** Pista que muestra la banda de monitor de #voz: la activa o, en reposo, la primera. */
  readonly airDemo = computed(() => this.voice[this.strip()?.active() ?? 0] ?? this.voice[0]);
  /** Avance de la pista activa; en reposo, 0. */
  readonly airProgress = computed(() => {
    const strip = this.strip();
    return strip && strip.active() !== null ? strip.progress() : 0;
  });
  /** true mientras suena una demo: enciende el piloto. */
  readonly airLive = computed(() => this.strip()?.playing() != null);

  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly document = inject(DOCUMENT);
  private sectionObserver: IntersectionObserver | null = null;
  private lastSectionObserver: IntersectionObserver | null = null;
  private reelObserver: IntersectionObserver | null = null;
  private reelEl: HTMLElement | null = null;
  private motionQuery: MediaQueryList | null = null;

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
      this.armReel();
      this.observeHero();
      this.observeSections();
    }
  }

  ngOnDestroy(): void {
    this.sectionObserver?.disconnect();
    this.lastSectionObserver?.disconnect();
    this.heroObserver?.disconnect();
    this.reelObserver?.disconnect();
    this.reelEl?.removeEventListener('focusin', this.revealReel);
    this.motionQuery?.removeEventListener?.('change', this.onMotionChange);
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

  /** Publica la sección visible para marcarla en la barra superior. */
  private observeSections(): void {
    const visible = new Set<string>();
    const lastId = SECTION_IDS[SECTION_IDS.length - 1];
    // La última sección puede ser más corta que el recorrido que queda hasta el final de la página y no
    // llegar nunca a la franja central: si se ve entera, es la activa.
    let lastFullyVisible = false;
    const publish = () =>
      this.navService.activeSection.set(lastFullyVisible ? lastId : (SECTION_IDS.find((id) => visible.has(id)) ?? null));

    this.sectionObserver = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          visible.add(entry.target.id);
        } else {
          visible.delete(entry.target.id);
        }
      }
      publish();
    }, { rootMargin: '-35% 0px -55% 0px' });
    for (const id of SECTION_IDS) {
      const el = this.document.getElementById(id);
      if (el) {
        this.sectionObserver.observe(el);
      }
    }

    const last = this.document.getElementById(lastId);
    if (last) {
      this.lastSectionObserver = new IntersectionObserver(([entry]) => {
        lastFullyVisible = entry.intersectionRatio >= LAST_SECTION_RATIO;
        publish();
      }, { threshold: LAST_SECTION_RATIO });
      this.lastSectionObserver.observe(last);
    }
  }

  /**
   * Arma la entrada del reel solo si aún no está a la vista (lo normal al entrar por el hero), sin movimiento
   * reducido y sin un enlace directo a una sección (`/home#fotos` deja el reel atrás, `#reel` ya lo enseña).
   * La entrada la dispara un observador propio del reel, no la sección activa de la barra: así ocurre aunque
   * se salte el reel con la barra y se vea solo en parte. Recibir el foco también la dispara.
   */
  private armReel(): void {
    const view = this.document.defaultView;
    const reel = this.document.getElementById('reel');
    if (!view || !reel) {
      return;
    }
    this.motionQuery = view.matchMedia?.('(prefers-reduced-motion: reduce)') ?? null;
    this.motionQuery?.addEventListener?.('change', this.onMotionChange);
    const hash = view.location.hash.slice(1);
    const deepLink = (SECTION_IDS as readonly string[]).includes(hash);
    const belowView = reel.getBoundingClientRect().top > view.innerHeight * REEL_ARM_RATIO;
    if (prefersReducedMotion(view) || deepLink || !belowView) {
      return;
    }
    this.reelArmed.set(true);
    this.reelEl = reel;
    reel.addEventListener('focusin', this.revealReel);
    this.reelObserver = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) {
        this.revealReel();
      }
    }, { threshold: REEL_SHOW_RATIO });
    this.reelObserver.observe(reel);
  }

  /** Entrada del reel, una sola vez: después ya no hace falta observarlo. */
  private readonly revealReel = (): void => {
    this.zone.run(() => this.reelShown.set(true));
    this.reelObserver?.disconnect();
    this.reelObserver = null;
    this.reelEl?.removeEventListener('focusin', this.revealReel);
  };

  /** Si se activa el movimiento reducido con la entrada aún armada, se desarma: todo queda visible y quieto. */
  private readonly onMotionChange = (event: MediaQueryListEvent): void => {
    if (event.matches && this.reelArmed()) {
      this.zone.run(() => this.reelArmed.set(false));
      this.revealReel();
    }
  };

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
