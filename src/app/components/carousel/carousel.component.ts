import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, HostListener, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';

interface CarouselImage {
  src: string;
  alt: string;
}

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.css'
})
export class CarouselComponent implements OnInit, OnDestroy {

  images: CarouselImage[] = [
    { src: 'assets/images/carousel/Pilar Blanco WEB_1.webp', alt: 'Pilar Blanco, actriz, de pie con camiseta negra en book fotográfico' },
    { src: 'assets/images/carousel/Pilar Blanco WEB_2.webp', alt: 'Pilar Blanco, actriz, en retrato de book fotográfico' },
    { src: 'assets/images/carousel/Pilar Blanco WEB_3.webp', alt: 'Pilar Blanco, actriz, posando en sesión de book' },
    { src: 'assets/images/carousel/Pilar Blanco WEB_4.webp', alt: 'Pilar Blanco, actriz, sentada en un taburete con ropa negra' },
    { src: 'assets/images/carousel/Pilar Blanco WEB_5.webp', alt: 'Pilar Blanco, actriz, en retrato artístico de galería' },
    { src: 'assets/images/carousel/Pilar Blanco WEB_6.webp', alt: 'Pilar Blanco, actriz, de pie con camisa blanca y vaqueros' },
    { src: 'assets/images/carousel/Pilar Blanco WEB_7.webp', alt: 'Pilar Blanco, actriz, en fotografía de book promocional' },
    { src: 'assets/images/carousel/Pilar Blanco WEB_8.webp', alt: 'Pilar Blanco, actriz, en retrato de carácter' },
    { src: 'assets/images/carousel/Pilar Blanco WEB_9.webp', alt: 'Pilar Blanco, actriz, en sesión fotográfica de galería' },
    { src: 'assets/images/carousel/Pilar Blanco WEB_10.webp', alt: 'Pilar Blanco, actriz, en retrato de book en color' },
    { src: 'assets/images/carousel/Pilar Blanco WEB_11.webp', alt: 'Pilar Blanco, actriz, en fotografía de galería web' },
    { src: 'assets/images/carousel/Pilar Blanco WEB_12.webp', alt: 'Pilar Blanco, actriz, sentada en un baúl en book fotográfico' }
  ];
  currentIndex: number = 0;
  firstImage: boolean = true;
  lastImage: boolean = false;
  autoplayInterval: any;
  direction: 'forward' | 'backward' = 'forward';
  isPlaying: boolean = true;
  interactionTimeout: any;
  touchStartX: number = 0;
  touchEndX: number = 0;
  private readonly isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);
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
  }

  startAutoplay() {
    if (!this.isBrowser) {
      return;
    }
    if (this.autoplayInterval) {
      return; // Si ya hay un intervalo en ejecución, no iniciar uno nuevo
    }
    this.autoplayInterval = setInterval(() => {
      if (this.direction === 'forward') {
        this.next(false); // Indica que no es una acción del usuario
      } else {
        this.prev(false); // Indica que no es una acción del usuario
      }
    }, 3000); // Cambia de imagen cada 3 segundos
    this.isPlaying = true;
  }

  stopAutoplay() {
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval);
      this.autoplayInterval = null; // Asegurarse de que el intervalo se reinicie
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
    }, 10000); // Reanuda el autoplay después de 10 segundos de inactividad
  }

  next(userInitiated: boolean = true) {
    if (userInitiated) {
      this.stopAutoplay();
      this.resetInteractionTimeout();
    }
    if (this.currentIndex < this.images.length - 1) {
      this.currentIndex++;
      this.firstImage = false;
      this.lastImage = false;
    } else {
      this.lastImage = true;
      this.direction = 'backward';
    }
  }

  prev(userInitiated: boolean = true) {
    if (userInitiated) {
      this.stopAutoplay();
      this.resetInteractionTimeout();
    }
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.firstImage = false;
      this.lastImage = false;
    } else {
      this.firstImage = true;
      this.direction = 'forward';
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
    const swipeThreshold = 50; // Umbral mínimo para considerar un deslizamiento
    if (this.touchEndX < this.touchStartX - swipeThreshold) {
      this.next(true); // Deslizar hacia la izquierda
    }
    if (this.touchEndX > this.touchStartX + swipeThreshold) {
      this.prev(true); // Deslizar hacia la derecha
    }
  }
}
