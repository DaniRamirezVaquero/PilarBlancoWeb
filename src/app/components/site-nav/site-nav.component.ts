import {
  ChangeDetectionStrategy, Component, DestroyRef, ElementRef, Injector, PLATFORM_ID, afterNextRender, computed,
  inject, signal, viewChild,
} from '@angular/core';
import { DOCUMENT, Location, isPlatformBrowser } from '@angular/common';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter } from 'rxjs';
import { NavService } from '../../services/nav.service';
import { isRouteActive, pathOf, scrollBehaviorFor, sectionForPage } from '../../utils/nav-scroll';

interface SectionLink {
  id: string;
  label: string;
}

/** Selector de lo que puede recibir foco dentro del menú móvil. */
const FOCUSABLE = 'a[href], button:not([disabled])';

/** Ancho (px) desde el que la barra muestra anclas y redes en línea en vez del menú. */
const DESKTOP_QUERY = '(min-width: 1024px)';

/** Barra superior fija: transparente sobre el hero de /home y de cristal en el resto. */
@Component({
  selector: 'app-site-nav',
  imports: [RouterLink],
  templateUrl: './site-nav.component.html',
  styleUrl: './site-nav.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '(document:keydown.escape)': 'onEscape()' },
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

  readonly instagramUrl = 'https://www.instagram.com/pilarblanco.actriz/';
  readonly vimeoUrl = 'https://vimeo.com/user18148957';
  readonly mailtoUrl = 'mailto:pilarblanco.actriz@gmail.com';

  private readonly nav = inject(NavService);
  private readonly router = inject(Router);
  private readonly document = inject(DOCUMENT);
  private readonly location = inject(Location);
  private readonly destroyRef = inject(DestroyRef);
  private readonly injector = inject(Injector);
  private readonly header = viewChild.required<ElementRef<HTMLElement>>('header');
  private readonly menuButton = viewChild.required<ElementRef<HTMLButtonElement>>('menuButton');
  private readonly menuPanel = viewChild<ElementRef<HTMLElement>>('menuPanel');
  private readonly closeButton = viewChild<ElementRef<HTMLButtonElement>>('closeButton');
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly url = signal(this.router.url);

  /** Menú a pantalla completa (móvil y tablet). */
  readonly menuOpen = signal(false);

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

  /** «CV» es un enlace de ruta: se marca en /curriculum. */
  readonly cvActive = computed(() => isRouteActive(this.url(), '/curriculum'));

  constructor() {
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => this.url.set(event.urlAfterRedirects));

    this.destroyRef.onDestroy(() => this.unlockBody());

    afterNextRender(() => {
      // Publica el alto real de la barra: lo usan scroll-margin y ViewportScroller.
      const header = this.header().nativeElement;
      const root = this.document.documentElement;
      const publish = () => root.style.setProperty('--nav-h', `${header.getBoundingClientRect().height}px`);
      publish();
      const observer = new ResizeObserver(publish);
      observer.observe(header);
      this.destroyRef.onDestroy(() => observer.disconnect());

      // Si la ventana pasa a escritorio con el menú abierto, se cierra para no dejar el scroll bloqueado.
      const query = this.document.defaultView?.matchMedia?.(DESKTOP_QUERY);
      if (query) {
        const onChange = (event: MediaQueryListEvent) => event.matches && this.closeMenu(false);
        query.addEventListener('change', onChange);
        this.destroyRef.onDestroy(() => query.removeEventListener('change', onChange));
      }
    });
  }

  isActive(id: string): boolean {
    return this.currentSection() === id;
  }

  /** Abre el menú, bloquea el scroll del body y lleva el foco al botón de cerrar. */
  openMenu(): void {
    if (!this.isBrowser || this.menuOpen()) {
      return;
    }
    this.menuOpen.set(true);
    this.document.body.style.overflow = 'hidden';
    afterNextRender(() => this.closeButton()?.nativeElement.focus(), { injector: this.injector });
  }

  /** Cierra el menú, libera el scroll y (salvo que se pida lo contrario) devuelve el foco al botón «Menú». */
  closeMenu(restoreFocus = true): void {
    if (!this.menuOpen()) {
      return;
    }
    this.menuOpen.set(false);
    this.unlockBody();
    if (restoreFocus) {
      this.menuButton().nativeElement.focus({ preventScroll: true });
    }
  }

  onEscape(): void {
    this.closeMenu();
  }

  /** Mantiene el foco dentro del panel: Tab en el último elemento vuelve al primero y Mayús+Tab al revés. */
  onPanelKeydown(event: KeyboardEvent): void {
    if (event.key !== 'Tab') {
      return;
    }
    const items = Array.from(this.menuPanel()?.nativeElement.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []);
    if (items.length === 0) {
      return;
    }
    const first = items[0];
    const last = items[items.length - 1];
    const current = this.document.activeElement;
    if (event.shiftKey && current === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && current === last) {
      event.preventDefault();
      first.focus();
    }
  }

  /** Elegir un ancla en el menú: se cierra (liberando el scroll del body) y después se desplaza. */
  onMenuAnchor(event: Event, id: string): void {
    this.closeMenu();
    this.goTo(event, id);
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

  private unlockBody(): void {
    if (this.isBrowser) {
      this.document.body.style.overflow = '';
    }
  }
}
