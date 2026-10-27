import { Directive, ElementRef, OnDestroy, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * Hace aparecer una sola vez, al llegar al visor, el contenido que empieza por debajo
 * de la primera pantalla. Solo actúa en el navegador y tras la hidratación: el HTML
 * prerrenderizado y la versión sin JS muestran todo. Con movimiento reducido no oculta nada.
 */
@Directive({ selector: '[appReveal]', standalone: true })
export class RevealDirective implements OnInit, OnDestroy {
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private observer?: IntersectionObserver;

  ngOnInit(): void {
    if (!this.isBrowser || typeof IntersectionObserver === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    // Lo que ya se ve al entrar lo cubre la entrada de la página.
    if (this.el.getBoundingClientRect().top < window.innerHeight * 0.9) return;

    this.el.classList.add('reveal-pending');
    this.observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        this.observer?.disconnect();
        this.el.classList.remove('reveal-pending');
        this.el.classList.add('reveal-in');
      },
      { rootMargin: '0px 0px -8% 0px' },
    );
    this.observer.observe(this.el);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
