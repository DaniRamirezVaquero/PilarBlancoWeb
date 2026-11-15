import { AfterViewInit, Component, HostBinding, inject } from '@angular/core';
import { DOCUMENT, ViewportScroller } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { SiteNavComponent } from './components/site-nav/site-nav.component';
import { FooterComponent } from './components/footer/footer.component';
import { SeoService } from './seo/seo.service';
import { HeroThemeService } from './services/hero-theme.service';
import { VercelAnalyticsService } from './services/vercel-analytics.service';
import { ANCHOR_GAP_PX } from './utils/nav-scroll';
import { filter } from 'rxjs';

@Component({
    selector: 'app-root',
    imports: [
        RouterOutlet,
        SiteNavComponent,
        FooterComponent
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent implements AfterViewInit {
  title = 'PilarBlancoWeb';

  @HostBinding('class.app-ready') appReady = this.readInitialAppReady();

  private readonly doc = inject(DOCUMENT);
  private readonly seo = inject(SeoService);
  /** Fija cover/tema de esta pestaña; no rota mientras la sesión sigue abierta. */
  private readonly _heroTheme = inject(HeroThemeService);
  /** Web Analytics de Vercel: pageviews en cada navegación del router. */
  private readonly _analytics = inject(VercelAnalyticsService);

  constructor(private router: Router) {
    // El scroll a un ancla del router ignora scroll-margin: se deja el hueco de la barra superior (su alto real).
    const document = inject(DOCUMENT);
    inject(ViewportScroller).setOffset(() => [
      0,
      (parseFloat(document.documentElement.style.getPropertyValue('--nav-h')) || 0) + ANCHOR_GAP_PX,
    ]);
    this.seo.updateForUrl(this.router.url);
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => {
        this.seo.updateForUrl(event.urlAfterRedirects);
      });
  }

  /** Lleva el foco al contenido principal sin cambiar de ruta. */
  skipToMain(event: Event): void {
    event.preventDefault();
    this.doc.getElementById('contenido')?.focus();
  }

  ngAfterViewInit(): void {
    if (this.appReady || typeof requestAnimationFrame === 'undefined') {
      return;
    }
    requestAnimationFrame(() => {
      this.appReady = true;
    });
  }

  /** El HTML prerenderizado ya trae app-ready: no lo quites al hidratar o la página se oculta y vuelve con fade. */
  private readInitialAppReady(): boolean {
    if (typeof document === 'undefined' || typeof requestAnimationFrame === 'undefined') {
      return true;
    }
    return !!document.querySelector('app-root.app-ready');
  }
}
