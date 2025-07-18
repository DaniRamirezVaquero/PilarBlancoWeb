import { Component, OnInit } from '@angular/core';
import { CarouselComponent } from '../../components/carousel/carousel.component';
import { CollageComponent } from '../../components/collage/collage.component';
import { DowloadGalleryBtnComponent } from '../../components/dowload-gallery-btn/dowload-gallery-btn.component';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-gallery-page',
  standalone: true,
  imports: [
    CarouselComponent,
    CollageComponent,
    DowloadGalleryBtnComponent
  ],
  templateUrl: './gallery-page.component.html',
  styleUrl: './gallery-page.component.css'
})
export class GalleryPageComponent implements OnInit {

  constructor(private seoService: SeoService) { }

  ngOnInit(): void {
    this.seoService.updatePageSeo({
      title: 'Galería - Pilar Blanco | Fotos Profesionales y Proyectos',
      description: 'Explora la galería fotográfica de Pilar Blanco con imágenes profesionales y proyectos destacados. Descarga el book completo y conoce su trabajo en diversos proyectos.',
      keywords: 'Pilar Blanco galería, fotos actriz, book fotográfico, proyectos cine, portfolio fotográfico, imágenes profesionales',
      ogImage: 'https://pilarblanco.com/assets/images/pilar-blanco-gallery.jpg',
      canonicalUrl: 'https://pilarblanco.com/gallery'
    });
  }
}
