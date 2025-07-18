import { Component, OnInit } from '@angular/core';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-bio-page',
  standalone: true,
  imports: [],
  templateUrl: './bio-page.component.html',
  styleUrl: './bio-page.component.css'
})
export class BioPageComponent implements OnInit {

  constructor(private seoService: SeoService) { }

  ngOnInit(): void {
    this.seoService.updatePageSeo({
      title: 'Biografía - Pilar Blanco | Trayectoria Profesional de la Actriz',
      description: 'Conoce la trayectoria profesional de Pilar Blanco, actriz con más de 30 años de experiencia. Desde Metronomoteatro hasta sus últimos trabajos en cine y televisión.',
      keywords: 'Pilar Blanco biografía, trayectoria actriz, Metronomoteatro, Plaza Alta, Array&aacute;n, Rey Gitano, Rabia Mediaset, Fernando Colomo, experiencia actriz',
      ogImage: 'https://pilarblanco.com/assets/images/pilar-blanco-bio.jpg',
      canonicalUrl: 'https://pilarblanco.com/bio'
    });
  }
}
