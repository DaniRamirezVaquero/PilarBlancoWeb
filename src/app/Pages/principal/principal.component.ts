import { Component, inject, OnInit } from '@angular/core';
import { PlayBtnComponent } from '../../components/play-btn/play-btn.component';
import { SideNavService } from '../../services/side-nav.service';
import { SeoService } from '../../services/seo.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-principal',
  standalone: true,
  imports: [
    PlayBtnComponent,
    CommonModule
  ],
  templateUrl: './principal.component.html',
  styleUrl: './principal.component.css'
})
export class PrincipalComponent implements OnInit {

  sideNavIsOpen: boolean = false;
  subscription: any;
  showReel: boolean = false;

  constructor(private seoService: SeoService) { }

  sideNavService = inject(SideNavService);

  ngOnInit(): void {
    this.sideNavService.isOpen$.subscribe(isOpen => {
      this.sideNavIsOpen = isOpen;
    });

    // SEO Configuration
    this.seoService.updatePageSeo({
      title: 'Pilar Blanco - Actriz Profesional | Portfolio Artístico',
      description: 'Bienvenido al portfolio de Pilar Blanco, actriz profesional con más de 30 años de experiencia en cine, televisión, teatro y doblaje. Descubre su reel y trayectoria artística.',
      keywords: 'Pilar Blanco, actriz, cine, televisión, teatro, doblaje, locución, portfolio, reel, España, Metronomoteatro, Ray Gitano, Rabia',
      ogImage: 'https://pilarblanco.com/assets/images/pilar-blanco-home.jpg',
      canonicalUrl: 'https://pilarblanco.com/'
    });
  }

  toggleShowReel() {
    this.showReel = !this.showReel;
  }
}
