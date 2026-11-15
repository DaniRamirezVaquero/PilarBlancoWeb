import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';
import { ChangeDetectorRef, Component, HostListener, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { IconComponent } from '../icon/icon.component';
import { CONTACT } from '../../data/portfolio.data';
import { prefersReducedMotion } from '../../utils/motion';
import { BOOK_PHOTOS, BookPhoto } from '../../data/photos.data';

interface CarouselSlide extends BookPhoto {
  id: string;
}

const SLIDE_MS = 500;

@Component({
    selector: 'app-carousel',
    imports: [CommonModule, IconComponent],
    templateUrl: './carousel.component.html',
    styleUrl: './carousel.component.css'
})
export class CarouselComponent implements OnInit, OnDestroy {

  /** Descarga del pack de fotos; vive en la barra de controles, bajo la foto. */
  readonly photosZip = CONTACT.photosZip;

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
    @Inject(DOCUMENT) private document: Document,
    private cdr: ChangeDetectorRef
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.slides = this.buildLoopSlides(BOOK_PHOTOS);
    this.lastRealIndex = BOOK_PHOTOS.length;
  }

  ngOnInit() {
    // Con movimiento reducido no arranca solo: la persona decide con el botón de reproducir.
    if (this.isBrowser && !prefersReducedMotion(this.document.defaultView)) {
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
      if (!prefersReducedMotion(this.document.defaultView)) {
        this.startAutoplay();
      }
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

  private buildLoopSlides(photos: readonly BookPhoto[]): CarouselSlide[] {
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
