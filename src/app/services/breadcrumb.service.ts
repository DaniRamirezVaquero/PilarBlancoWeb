import { Injectable } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

export interface Breadcrumb {
  label: string;
  url: string;
}

@Injectable({
  providedIn: 'root'
})
export class BreadcrumbService {
  private breadcrumbsSubject = new BehaviorSubject<Breadcrumb[]>([]);
  public breadcrumbs$ = this.breadcrumbsSubject.asObservable();

  private routeLabels: { [key: string]: string } = {
    '': 'Inicio',
    'home': 'Inicio',
    'bio': 'Biografía',
    'video': 'Videos',
    'gallery': 'Galería',
    'voice': 'Voz',
    'curriculum': 'Currículum',
    'contact': 'Contacto'
  };

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => this.buildBreadcrumbs());
  }

  private buildBreadcrumbs(): void {
    const url = this.router.url;
    const segments = url.split('/').filter(segment => segment);

    const breadcrumbs: Breadcrumb[] = [
      { label: 'Inicio', url: '/' }
    ];

    if (segments.length > 0 && segments[0] !== 'home') {
      const currentRoute = segments[0];
      const label = this.routeLabels[currentRoute] || currentRoute;
      breadcrumbs.push({ label, url: `/${currentRoute}` });
    }

    this.breadcrumbsSubject.next(breadcrumbs);
  }

  generateStructuredData(): string {
    const breadcrumbs = this.breadcrumbsSubject.value;
    if (breadcrumbs.length <= 1) return '';

    const listItems = breadcrumbs.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.label,
      "item": `https://pilarblanco.com${item.url === '/' ? '' : item.url}`
    }));

    return JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": listItems
    });
  }
}
