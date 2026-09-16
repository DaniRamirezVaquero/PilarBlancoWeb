import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ChangeDetectorRef, Component, HostListener, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';

interface CarouselImage {
  src: string;
  srcset: string;
  alt: string;
}

interface CarouselSlide extends CarouselImage {
  id: string;
}

/** Construye el src y el srcset responsivo (900w/1400w) para una foto del carrusel. */
function photo(name: string, alt: string): CarouselImage {
  const base = `assets/images/carousel/${name}`;
  return {
    src: `${base}-900.webp`,
    srcset: `${base}-900.webp 900w, ${base}-1400.webp 1400w`,
    alt
  };
}

const SLIDE_MS = 500;

@Component({
    selector: 'app-carousel',
    imports: [CommonModule],
    templateUrl: './carousel.component.html',
    styleUrl: './carousel.component.css'
})
export class CarouselComponent implements OnInit, OnDestroy {

  private readonly photos: CarouselImage[] = [
    photo('Pilar Blanco WEB_1', 'Pilar Blanco, actriz, de pie con camiseta negra en book fotográfico'),
    photo('Pilar Blanco WEB_2', 'Pilar Blanco, actriz, en retrato de book fotográfico'),
    photo('Pilar Blanco WEB_3', 'Pilar Blanco, actriz, posando en sesión de book'),
    photo('Pilar Blanco WEB_4', 'Pilar Blanco, actriz, sentada en un taburete con ropa negra'),
    photo('Pilar Blanco WEB_5', 'Pilar Blanco, actriz, en retrato artístico de galería'),
    photo('Pilar Blanco WEB_6', 'Pilar Blanco, actriz, de pie con camisa blanca y vaqueros'),
    photo('Pilar Blanco WEB_7', 'Pilar Blanco, actriz, en fotografía de book promocional'),
    photo('Pilar Blanco WEB_8', 'Pilar Blanco, actriz, en retrato de carácter'),
    photo('Pilar Blanco WEB_9', 'Pilar Blanco, actriz, en sesión fotográfica de galería'),
    photo('Pilar Blanco WEB_10', 'Pilar Blanco, actriz, en retrato de book en color'),
    photo('Pilar Blanco WEB_11', 'Pilar Blanco, actriz, en fotografía de galería web'),
    photo('Pilar Blanco WEB_12', 'Pilar Blanco, actriz, sentada en un baúl en book fotográfico')
  ];

  slides: CarouselSlide[] = [];
  /** Índice 1 = primera foto real; 0 y el último son clones para el loop infinito. */
  currentIndex = 1;
  enableTransition = true;
  autoplayInterval: ReturnType<typeof setInterval> | null = null;
  isPlaying = true;
  interactionTimeout: ReturnType<typeof setTimeout> | null = null;
  touchStartX = 0;
  touchEndX = 0;
  private wrapTimeout: ReturnType<typeof setTimeout> | null = null;
  private isWrapping = false;
  private readonly isBrowser: boolean;
  private readonly lastRealIndex: number;

  constructor(
    @Inject(PLATFORM_ID) platformId: object,
    private cdr: ChangeDetectorRef
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.slides = this.buildLoopSlides(this.photos);
    this.lastRealIndex = this.photos.length;
  }

  ngOnInit() {
    if (this.isBrowser) {
      this.startAutoplay();
    } else {
      this.isPlaying = false;
    }
  }

  ngOnDestroy() {
    this.stopAutoplay();
    this.clearWrapTimeout();
    if (this.interactionTimeout) {
      clearTimeout(this.interactionTimeout);
    }
  }

  trackSlide(_index: number, slide: CarouselSlide): string {
    return slide.id;
  }

  startAutoplay() {
    if (!this.isBrowser) {
      return;
    }
    if (this.autoplayInterval) {
      return;
    }
    this.autoplayInterval = setInterval(() => {
      this.next(false);
    }, 3000);
    this.isPlaying = true;
  }

  stopAutoplay() {
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval);
      this.autoplayInterval = null;
      this.isPlaying = false;
    }
  }

  toggleAutoplay() {
    if (this.isPlaying) {
      this.stopAutoplay();
    } else {
      this.startAutoplay();
    }
  }

  resetInteractionTimeout() {
    if (!this.isBrowser) {
      return;
    }
    if (this.interactionTimeout) {
      clearTimeout(this.interactionTimeout);
    }
    this.interactionTimeout = setTimeout(() => {
      this.startAutoplay();
    }, 10000);
  }

  next(userInitiated: boolean = true) {
    if (this.isWrapping) {
      return;
    }
    if (userInitiated) {
      this.stopAutoplay();
      this.resetInteractionTimeout();
    }
    this.currentIndex++;
    if (this.currentIndex === this.slides.length - 1) {
      this.queueWrapSnap(1);
    }
  }

  prev(userInitiated: boolean = true) {
    if (this.isWrapping) {
      return;
    }
    if (userInitiated) {
      this.stopAutoplay();
      this.resetInteractionTimeout();
    }
    this.currentIndex--;
    if (this.currentIndex === 0) {
      this.queueWrapSnap(this.lastRealIndex);
    }
  }

  @HostListener('touchstart', ['$event'])
  onTouchStart(event: TouchEvent) {
    this.touchStartX = event.changedTouches[0].screenX;
  }

  @HostListener('touchend', ['$event'])
  onTouchEnd(event: TouchEvent) {
    this.touchEndX = event.changedTouches[0].screenX;
    this.handleSwipe();
  }

  handleSwipe() {
    const swipeThreshold = 50;
    if (this.touchEndX < this.touchStartX - swipeThreshold) {
      this.next(true);
    }
    if (this.touchEndX > this.touchStartX + swipeThreshold) {
      this.prev(true);
    }
  }

  private buildLoopSlides(photos: CarouselImage[]): CarouselSlide[] {
    if (photos.length === 0) {
      return [];
    }
    const first = photos[0];
    const last = photos[photos.length - 1];
    return [
      { ...last, id: 'clone-last' },
      ...photos.map((item, index) => ({ ...item, id: `photo-${index}` })),
      { ...first, id: 'clone-first' }
    ];
  }

  private queueWrapSnap(realIndex: number) {
    this.isWrapping = true;
    this.clearWrapTimeout();
    this.wrapTimeout = setTimeout(() => {
      this.snapTo(realIndex);
    }, SLIDE_MS);
  }

  private snapTo(index: number) {
    this.enableTransition = false;
    this.currentIndex = index;
    this.cdr.detectChanges();
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        this.enableTransition = true;
        this.isWrapping = false;
        this.cdr.markForCheck();
      });
    });
  }

  private clearWrapTimeout() {
    if (this.wrapTimeout) {
      clearTimeout(this.wrapTimeout);
      this.wrapTimeout = null;
    }
  }
}
