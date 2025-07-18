import { Component, OnInit } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { SideNavigationComponent } from './components/side-navigation/side-navigation.component';
import { FooterComponent } from './components/footer/footer.component';
import { CaptchaComponent } from './components/captcha/captcha.component';
import { PerformanceService } from './services/performance.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    SideNavigationComponent,
    FooterComponent,
    CaptchaComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'PilarBlancoWeb';

  showFooter: boolean = true;
  showCaptcha: boolean = false;

  constructor(
    private router: Router,
    private performanceService: PerformanceService
  ) {
    router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        this.updateVisibility(val.url);
      }
    });
  }

  ngOnInit(): void {
    // Inicializar servicios de performance
    this.performanceService.measurePageLoadTime();
    this.performanceService.preloadCriticalResources();
    this.performanceService.optimizeImages();
    this.performanceService.checkWebVitals();
  }

  private updateVisibility(url: string): void {
    this.showFooter = url !== '/home';
    this.showCaptcha = url === '/contact';
  }
}
