import { CommonModule } from '@angular/common';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.css'
})
export class CarouselComponent implements OnInit, OnDestroy {

  images: string[] = [
    'assets/images/carousel/Pilar Blanco WEB_1.webp',
    'assets/images/carousel/Pilar Blanco WEB_2.webp',
    'assets/images/carousel/Pilar Blanco WEB_3.webp',
    'assets/images/carousel/Pilar Blanco WEB_4.webp',
    'assets/images/carousel/Pilar Blanco WEB_5.webp',
    'assets/images/carousel/Pilar Blanco WEB_6.webp',
    'assets/images/carousel/Pilar Blanco WEB_7.webp',
    'assets/images/carousel/Pilar Blanco WEB_8.webp',
    'assets/images/carousel/Pilar Blanco WEB_9.webp',
    'assets/images/carousel/Pilar Blanco WEB_10.webp',
    'assets/images/carousel/Pilar Blanco WEB_11.webp',
    'assets/images/carousel/Pilar Blanco WEB_12.webp'
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

  ngOnInit() {
    this.startAutoplay();
  }

  ngOnDestroy() {
    this.stopAutoplay();
  }

  startAutoplay() {
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
