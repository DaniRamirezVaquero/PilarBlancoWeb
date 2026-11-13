import {
  ChangeDetectionStrategy, Component, DestroyRef, ElementRef, PLATFORM_ID, afterNextRender, computed, effect,
  inject, signal, viewChild,
} from '@angular/core';
import { DOCUMENT, Location, isPlatformBrowser } from '@angular/common';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter } from 'rxjs';
import { NavService } from '../../services/nav.service';
import { SocialsComponent } from '../socials/socials.component';
import { centeredScrollLeft, pathOf, scrollBehaviorFor, sectionForPage } from '../../utils/nav-scroll';

interface SectionLink {
  id: string;
  label: string;
}

/** Barra superior fija: transparente sobre el hero de /home y de cristal en el resto. */
@Component({
  selector: 'app-site-nav',
  imports: [RouterLink, SocialsComponent],
  templateUrl: './site-nav.component.html',
  styleUrl: './site-nav.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SiteNavComponent {
  /** Secciones de la home a las que apunta la barra, como anclas. */
  readonly sections: readonly SectionLink[] = [
    { id: 'reel', label: 'Reel' },
    { id: 'fotos', label: 'Fotos' },
    { id: 'voz', label: 'Voz' },
    { id: 'trayectoria', label: 'Trayectoria' },
    { id: 'contacto', label: 'Contacto' },
  ];

  private readonly nav = inject(NavService);
  private readonly router = inject(Router);
  private readonly document = inject(DOCUMENT);
  private readonly location = inject(Location);
  private readonly destroyRef = inject(DestroyRef);
  private readonly header = viewChild.required<ElementRef<HTMLElement>>('header');
  private readonly linksRow = viewChild.required<ElementRef<HTMLElement>>('linksRow');
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly url = signal(this.router.url);

  readonly onHome = computed(() => {
    const path = pathOf(this.url());
    return path === '/' || path === '/home';
  });
  /** Cristal en las páginas internas y, en la home, una vez pasado el hero. */
  readonly solid = computed(() => !this.onHome() || this.nav.heroPassed());

  /** Ancla marcada: la sección a la vista en la home o, en /voice y /video, la que les corresponde. */
  readonly currentSection = computed(() =>
    this.onHome() ? this.nav.activeSection() : sectionForPage(this.url()),
  );

  constructor() {
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => this.url.set(event.urlAfterRedirects));

    // Mantiene visible el ancla activa en la fila deslizable (móvil) sin mover la página.
    effect(() => {
      const id = this.currentSection();
      if (!this.isBrowser) {
        return;
      }
      // Sin sección activa (arriba del todo) la fila vuelve al principio para que se vean Reel y Fotos.
      requestAnimationFrame(() =>
        id ? this.revealLink(id) : this.linksRow().nativeElement.scrollTo({ left: 0, behavior: scrollBehaviorFor(this.document.defaultView) }),
      );
    });

    // Publica el alto real de la barra: lo usan scroll-margin y ViewportScroller.
    afterNextRender(() => {
      const header = this.header().nativeElement;
      const root = this.document.documentElement;
      const publish = () => root.style.setProperty('--nav-h', `${header.getBoundingClientRect().height}px`);
      publish();
      const observer = new ResizeObserver(publish);
      observer.observe(header);
      this.destroyRef.onDestroy(() => observer.disconnect());
    });
  }

  isActive(id: string): boolean {
    return this.currentSection() === id;
  }

  /** Desplaza solo la fila de anclas para centrar el enlace; scrollIntoView movería también la página. */
  private revealLink(id: string): void {
    const row = this.linksRow().nativeElement;
    const link = row.querySelector<HTMLElement>(`[data-section="${id}"]`);
    if (!link || row.scrollWidth <= row.clientWidth) {
      return;
    }
    const rowBox = row.getBoundingClientRect();
    const linkBox = link.getBoundingClientRect();
    const left = centeredScrollLeft(
      row.clientWidth,
      row.scrollWidth,
      row.scrollLeft + (linkBox.left - rowBox.left),
      linkBox.width,
    );
    row.scrollTo({ left, behavior: scrollBehaviorFor(this.document.defaultView) });
  }

  /** En la home el router no repite una URL igual: se desplaza la propia barra y se actualiza el hash. */
  goTo(event: Event, id: string | null): void {
    if (!this.isBrowser || !this.onHome()) {
      return;
    }
    const target = id ? this.document.getElementById(id) : this.document.documentElement;
    if (!target) {
      return;
    }
    event.preventDefault();
    const behavior = scrollBehaviorFor(this.document.defaultView);
    if (id) {
      target.scrollIntoView({ behavior, block: 'start' });
    } else {
      window.scrollTo({ top: 0, behavior });
    }
    this.location.replaceState(id ? `/home#${id}` : '/home');
  }
}
