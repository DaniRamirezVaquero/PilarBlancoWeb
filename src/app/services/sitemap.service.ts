import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SitemapService {

  private routes = [
    { path: '', priority: '1.0', changefreq: 'monthly' },
    { path: '/bio', priority: '0.8', changefreq: 'yearly' },
    { path: '/video', priority: '0.9', changefreq: 'monthly' },
    { path: '/gallery', priority: '0.8', changefreq: 'monthly' },
    { path: '/voice', priority: '0.8', changefreq: 'monthly' },
    { path: '/curriculum', priority: '0.7', changefreq: 'yearly' },
    { path: '/contact', priority: '0.6', changefreq: 'yearly' }
  ];

  generateSitemap(baseUrl: string = 'https://pilarblanco.com'): string {
    const currentDate = new Date().toISOString().split('T')[0];

    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
`;

    this.routes.forEach(route => {
      const url = route.path === '' ? baseUrl : `${baseUrl}${route.path}`;
      sitemap += `
  <url>
    <loc>${url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`;
    });

    sitemap += `
</urlset>`;

    return sitemap;
  }

  generateRobotsTxt(baseUrl: string = 'https://pilarblanco.com'): string {
    return `User-agent: *
Allow: /

# Sitemap
Sitemap: ${baseUrl}/sitemap.xml

# Directivas adicionales
Disallow: /assets/CV.pdf
Disallow: /assets/tapes/
Disallow: /backend/

# Crawl delay
Crawl-delay: 1`;
  }
}
