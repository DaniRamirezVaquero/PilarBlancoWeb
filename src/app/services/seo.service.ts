import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class SeoService {

  constructor(
    private meta: Meta,
    private title: Title
  ) { }

  updateTitle(title: string) {
    this.title.setTitle(title);
  }

  updateDescription(description: string) {
    this.meta.updateTag({ name: 'description', content: description });
  }

  updateKeywords(keywords: string) {
    this.meta.updateTag({ name: 'keywords', content: keywords });
  }

  updateOgTags(title: string, description: string, image?: string, url?: string) {
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'twitter:title', content: title });
    this.meta.updateTag({ property: 'twitter:description', content: description });

    if (image) {
      this.meta.updateTag({ property: 'og:image', content: image });
      this.meta.updateTag({ property: 'twitter:image', content: image });
    }

    if (url) {
      this.meta.updateTag({ property: 'og:url', content: url });
      this.meta.updateTag({ property: 'twitter:url', content: url });
    }
  }

  updateCanonical(url: string) {
    // Remove existing canonical link
    const existingCanonical = document.querySelector('link[rel="canonical"]');
    if (existingCanonical) {
      existingCanonical.remove();
    }

    // Add new canonical link
    const link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    link.setAttribute('href', url);
    document.head.appendChild(link);
  }

  updatePageSeo(config: {
    title: string;
    description: string;
    keywords: string;
    ogImage?: string;
    canonicalUrl?: string;
  }) {
    this.updateTitle(config.title);
    this.updateDescription(config.description);
    this.updateKeywords(config.keywords);
    this.updateOgTags(config.title, config.description, config.ogImage, config.canonicalUrl);

    if (config.canonicalUrl) {
      this.updateCanonical(config.canonicalUrl);
    }
  }
}
