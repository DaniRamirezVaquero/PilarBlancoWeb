import { Component, OnInit } from '@angular/core';
import { DownloadCvBtnComponent } from '../../components/download-cv-btn/download-cv-btn.component';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-cvpage',
  standalone: true,
  imports: [
    DownloadCvBtnComponent
  ],
  templateUrl: './cv-page.component.html',
  styleUrl: './cv-page.component.css'
})
export class CVPageComponent implements OnInit {

  constructor(private seoService: SeoService) { }

  ngOnInit(): void {
    this.seoService.updatePageSeo({
      title: 'Currículum - Pilar Blanco | CV Profesional de Actriz',
      description: 'Descarga el currículum profesional de Pilar Blanco. CV completo con su formación, experiencia en cine, televisión, teatro y doblaje.',
      keywords: 'Pilar Blanco CV, currículum actriz, experiencia profesional, formación actriz, download CV, curriculum vitae',
      ogImage: 'https://pilarblanco.com/assets/images/pilar-blanco-cv.jpg',
      canonicalUrl: 'https://pilarblanco.com/curriculum'
    });
  }
}
