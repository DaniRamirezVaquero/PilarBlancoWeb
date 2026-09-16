import { Injectable, inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { inject as injectAnalytics, pageview } from '@vercel/analytics';
import { filter } from 'rxjs';
import { environment } from '../../environments/environment';

/** Vercel Web Analytics: script en el cliente y un pageview por navegación del router. */

@Injectable({
  providedIn: 'root'
})
export class VercelAnalyticsService {
  private readonly router = inject(Router);

  constructor() {
    if (typeof window === 'undefined') {
      return;
    }

    injectAnalytics({
      framework: 'angular',
      mode: environment.production ? 'production' : 'development',
      disableAutoTrack: true,
    });

    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => {
        const path = event.urlAfterRedirects;
        pageview({ path, route: path.split('?')[0] });
      });
  }
}
