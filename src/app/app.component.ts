import { AfterViewInit, Component, HostBinding, inject } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { SideNavigationComponent } from './components/side-navigation/side-navigation.component';
import { FooterComponent } from './components/footer/footer.component';
import { SeoService } from './seo/seo.service';
import { HeroThemeService } from './services/hero-theme.service';
import { VercelAnalyticsService } from './services/vercel-analytics.service';
import { filter } from 'rxjs';

@Component({
    selector: 'app-root',
    imports: [
        RouterOutlet,
        HeaderComponent,
        SideNavigationComponent,
        FooterComponent
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent implements AfterViewInit {
  title = 'PilarBlancoWeb';

  @HostBinding('class.app-ready') appReady = this.readInitialAppReady();

  showFooter: boolean = true;

  private readonly seo = inject(SeoService);
  /** Fija cover/tema de esta pestaña; no rota mientras la sesión sigue abierta. */
  private readonly _heroTheme = inject(HeroThemeService);
  /** Web Analytics de Vercel: pageviews en cada navegación del router. */
  private readonly _analytics = inject(VercelAnalyticsService);

  constructor(private router: Router) {
    this.seo.updateForUrl(this.router.url);
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => {
        this.updateVisibility(event.urlAfterRedirects);
        this.seo.updateForUrl(event.urlAfterRedirects);
      });
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

  private updateVisibility(url: string): void {
    this.showFooter = url !== '/home';
  }
}
