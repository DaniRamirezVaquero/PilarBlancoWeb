import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { environment } from '../../environments/environment';
import {
  DEFAULT_OG_IMAGE_ALT,
  DEFAULT_OG_IMAGE_PATH,
  PERSON_DESCRIPTION,
  PERSON_KNOWS_ABOUT,
  PERSON_SAME_AS,
  SEO_PAGES,
  SITE_NAME,
  SeoPage,
} from './seo.data';

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly document = inject(DOCUMENT);

  updateForUrl(url: string): void {
    const path = this.normalizePath(url);
    const page = SEO_PAGES[path] ?? SEO_PAGES['/home'];
    this.apply(page);
  }

  private apply(page: SeoPage): void {
    const canonical = this.absoluteUrl(page.path);
    const image = this.absoluteUrl(DEFAULT_OG_IMAGE_PATH);
    const ogType = page.ogType ?? 'website';

    this.title.setTitle(page.title);
    this.document.documentElement.lang = 'es';

    this.upsertName('description', page.description);
    this.upsertName('robots', 'index, follow');
    this.upsertName('author', SITE_NAME);
    this.upsertProperty('og:type', ogType);
    this.upsertProperty('og:site_name', SITE_NAME);
    this.upsertProperty('og:locale', 'es_ES');
    this.upsertProperty('og:title', page.title);
    this.upsertProperty('og:description', page.description);
    this.upsertProperty('og:url', canonical);
    this.upsertProperty('og:image', image);
    this.upsertProperty('og:image:alt', DEFAULT_OG_IMAGE_ALT);
    this.upsertName('twitter:card', 'summary_large_image');
    this.upsertName('twitter:title', page.title);
    this.upsertName('twitter:description', page.description);
    this.upsertName('twitter:image', image);
    this.upsertName('twitter:image:alt', DEFAULT_OG_IMAGE_ALT);

    this.setCanonical(canonical);
    this.setJsonLd(this.buildJsonLd(page, canonical, image));
  }

  private buildJsonLd(page: SeoPage, canonical: string, image: string): object[] {
    const person = {
      '@context': 'https://schema.org',
      '@type': ['Person', 'Actor'],
      '@id': `${environment.siteUrl}/#person`,
      name: SITE_NAME,
      url: this.absoluteUrl('/home'),
      image,
      jobTitle: 'Actriz',
      description: PERSON_DESCRIPTION,
      nationality: {
        '@type': 'Country',
        name: 'España',
      },
      knowsLanguage: [
        { '@type': 'Language', name: 'Español', alternateName: 'es' },
        { '@type': 'Language', name: 'Inglés', alternateName: 'en' },
        { '@type': 'Language', name: 'Francés', alternateName: 'fr' },
      ],
      knowsAbout: PERSON_KNOWS_ABOUT,
      sameAs: PERSON_SAME_AS,
      height: {
        '@type': 'QuantitativeValue',
        value: 165,
        unitCode: 'CMT',
      },
      memberOf: {
        '@type': 'Organization',
        name: 'OK Agencia',
        url: 'https://okagencia.com/ficha.php?idactor=2133&gr=aa',
      },
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'professional',
        email: 'pilarblanco.actriz@gmail.com',
        availableLanguage: ['Spanish', 'English'],
      },
    };

    const breadcrumbItems = [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Inicio',
        item: this.absoluteUrl('/home'),
      },
    ];

    if (page.path !== '/home') {
      breadcrumbItems.push({
        '@type': 'ListItem',
        position: 2,
        name: page.breadcrumb,
        item: canonical,
      });
    }

    const breadcrumb = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbItems,
    };

    const webPage = {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      '@id': `${canonical}#webpage`,
      url: canonical,
      name: page.title,
      description: page.description,
      inLanguage: 'es',
      isPartOf: {
        '@type': 'WebSite',
        '@id': `${environment.siteUrl}/#website`,
        name: SITE_NAME,
        url: environment.siteUrl,
        inLanguage: 'es',
      },
      about: { '@id': `${environment.siteUrl}/#person` },
    };

    return [person, webPage, breadcrumb];
  }

  private setCanonical(url: string): void {
    let link = this.document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.document.head.appendChild(link);
    }
    link.setAttribute('href', url);
  }

  private setJsonLd(graph: object[]): void {
    const existing = this.document.querySelectorAll('script[data-seo-jsonld="true"]');
    existing.forEach((node) => node.remove());

    for (const data of graph) {
      const script = this.document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-seo-jsonld', 'true');
      script.textContent = JSON.stringify(data);
      this.document.head.appendChild(script);
    }
  }

  private upsertName(key: string, content: string): void {
    this.meta.updateTag({ name: key, content });
  }

  private upsertProperty(key: string, content: string): void {
    this.meta.updateTag({ property: key, content });
  }

  private absoluteUrl(path: string): string {
    const normalized = path.startsWith('/') ? path : `/${path}`;
    return `${environment.siteUrl}${normalized}`;
  }

  private normalizePath(url: string): string {
    const path = url.split('?')[0].split('#')[0];
    if (path === '' || path === '/') {
      return '/home';
    }
    return path.endsWith('/') && path.length > 1 ? path.slice(0, -1) : path;
  }
}
