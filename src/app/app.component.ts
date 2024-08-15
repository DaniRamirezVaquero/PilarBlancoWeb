import { Component } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { SideNavigationComponent } from './components/side-navigation/side-navigation.component';
import { FooterComponent } from './components/footer/footer.component';
import { CaptchaComponent } from './components/captcha/captcha.component';

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
export class AppComponent {
  title = 'PilarBlancoWeb';

  showFooter: boolean = true;
  showCaptcha: boolean = false;

  constructor(private router: Router) {
    router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        console.log('NavigationEnd:', val.url); // Log the URL
        this.updateVisibility(val.url);
      }
    });
  }

  private updateVisibility(url: string): void {
    this.showFooter = url !== '/main';
    this.showCaptcha = url === '/contact';
  }
}
