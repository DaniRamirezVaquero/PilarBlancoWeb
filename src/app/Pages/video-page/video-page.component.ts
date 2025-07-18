import { Component, OnInit } from '@angular/core';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-video-page',
  standalone: true,
  imports: [],
  templateUrl: './video-page.component.html',
  styleUrl: './video-page.component.css'
})
export class VideoPageComponent implements OnInit {

  constructor(private seoService: SeoService) { }

  ngOnInit(): void {
    this.seoService.updatePageSeo({
      title: 'Videos - Pilar Blanco | Reel y Escenas de Actuación',
      description: 'Descubre el reel de actuación de Pilar Blanco y sus mejores escenas en cine y televisión. Videos profesionales que muestran su versatilidad como actriz.',
      keywords: 'Pilar Blanco videos, reel actuación, escenas cine, televisión, portfolio video, actriz profesional, demo reel',
      ogImage: 'https://pilarblanco.com/assets/images/pilar-blanco-video.jpg',
      canonicalUrl: 'https://pilarblanco.com/video'
    });
  }
}
