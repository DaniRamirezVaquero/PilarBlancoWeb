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

  imageDescriptions: string[] = [
    'Pilar Blanco, actriz profesional - Retrato artístico 1',
    'Pilar Blanco, actriz especializada en cine y televisión - Retrato 2',
    'Foto profesional de Pilar Blanco para casting - Imagen 3',
    'Retrato actoral de Pilar Blanco - Imagen profesional 4',
    'Pilar Blanco, actriz de teatro y doblaje - Foto artística 5',
    'Imagen profesional de Pilar Blanco para portfolio - Retrato 6',
    'Pilar Blanco, actriz con experiencia en audiovisual - Foto 7',
    'Retrato profesional de la actriz Pilar Blanco - Imagen 8',
    'Pilar Blanco, especialista en interpretación - Foto artística 9',
    'Imagen de portfolio de Pilar Blanco, actriz - Retrato 10',
    'Foto profesional de Pilar Blanco para casting - Imagen 11',
    'Retrato final de Pilar Blanco, actriz profesional - Imagen 12'
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

  getImageAlt(index: number): string {
    return this.imageDescriptions[index] || `Pilar Blanco, actriz profesional - Imagen ${index + 1}`;
  }

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
