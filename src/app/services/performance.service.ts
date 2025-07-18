import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PerformanceService {

  measurePageLoadTime(): void {
    if (typeof window !== 'undefined' && window.performance) {
      window.addEventListener('load', () => {
        const loadTime = window.performance.timing.loadEventEnd - window.performance.timing.navigationStart;
        console.log(`Tiempo de carga de la página: ${loadTime}ms`);

        // Enviar métricas a Google Analytics si está configurado
        if ((window as any).gtag) {
          (window as any).gtag('event', 'timing_complete', {
            'name': 'load',
            'value': loadTime
          });
        }
      });
    }
  }

  preloadCriticalResources(): void {
    // Precargar imágenes críticas
    const criticalImages = [
      '/assets/images/Fondo2.jpg',
      '/assets/images/carousel/Pilar Blanco WEB_1.webp'
    ];

    criticalImages.forEach(src => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      document.head.appendChild(link);
    });
  }

  optimizeImages(): void {
    // Función para implementar lazy loading en imágenes que no lo tengan
    const images = document.querySelectorAll('img:not([loading])');
    images.forEach(img => {
      if (img.getBoundingClientRect().top > window.innerHeight) {
        img.setAttribute('loading', 'lazy');
      }
    });
  }

  checkWebVitals(): void {
    // Implementar medición de Core Web Vitals
    if (typeof window !== 'undefined') {
      // LCP (Largest Contentful Paint)
      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        console.log('LCP:', lastEntry.startTime);
      }).observe({ entryTypes: ['largest-contentful-paint'] });

      // CLS (Cumulative Layout Shift)
      let clsValue = 0;
      new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
          }
        }
        console.log('CLS:', clsValue);
      }).observe({ entryTypes: ['layout-shift'] });
    }
  }
}
