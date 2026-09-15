import { AfterViewInit, Component, HostBinding, inject } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { SideNavigationComponent } from './components/side-navigation/side-navigation.component';
import { FooterComponent } from './components/footer/footer.component';
import { SeoService } from './seo/seo.service';
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

  @HostBinding('class.app-ready') appReady = typeof requestAnimationFrame === 'undefined';

  showFooter: boolean = true;

  private readonly seo = inject(SeoService);

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

  private updateVisibility(url: string): void {
    this.showFooter = url !== '/home';
  }
}
