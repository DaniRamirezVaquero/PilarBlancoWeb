import { ChangeDetectionStrategy, Component, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter } from 'rxjs';
import { NavService } from '../../services/nav.service';
import { SocialsComponent } from '../socials/socials.component';

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
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly url = signal(this.router.url);

  readonly onHome = computed(() => {
    const path = this.url().split(/[?#]/)[0];
    return path === '/' || path === '/home';
  });
  /** Cristal en las páginas internas y, en la home, una vez pasado el hero. */
  readonly solid = computed(() => !this.onHome() || this.nav.heroPassed());

  constructor() {
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => this.url.set(event.urlAfterRedirects));
  }

  isActive(id: string): boolean {
    return this.onHome() && this.nav.activeSection() === id;
  }

  /** En la home el router no repite una URL igual: se desplaza la propia barra. */
  goTo(event: Event, id: string | null): void {
    if (!this.isBrowser || !this.onHome()) {
      return;
    }
    const target = id ? this.document.getElementById(id) : this.document.documentElement;
    if (!target) {
      return;
    }
    event.preventDefault();
    if (id) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}
