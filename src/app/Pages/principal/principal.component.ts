import { Component, inject, OnInit, ElementRef, HostListener } from '@angular/core';
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

  constructor(private elementRef: ElementRef) { }

  sideNavService = inject(SideNavService);
  seoService = inject(SeoService);

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

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    const container = this.elementRef.nativeElement.querySelector('.hero-container');
    const nameElement = this.elementRef.nativeElement.querySelector('.interactive-name');

    if (container && nameElement) {
      // Quitar la clase de retorno para transición rápida durante movimiento
      nameElement.classList.remove('returning');

      const rect = container.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Calcular la posición relativa del mouse
      const mouseX = event.clientX - centerX;
      const mouseY = event.clientY - centerY;

      // Calcular rotación más notable (máximo 8 grados)
      const rotateX = (mouseY / rect.height) * -15;
      const rotateY = (mouseX / rect.width) * 15;

      // Aplicar transformación 3D más notable
      nameElement.style.transform = `
        perspective(800px)
        rotateX(${Math.max(-8, Math.min(8, rotateX))}deg)
        rotateY(${Math.max(-8, Math.min(8, rotateY))}deg)
        translateZ(20px)
      `;

      // Calcular posición del gradiente dinámico - más responsivo
      const mousePercentX = ((event.clientX - rect.left) / rect.width) * 100;

      // Actualizar variable CSS para el gradiente más dinámico
      container.style.setProperty('--glow-x', `${mousePercentX - 75}%`);
    }
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    const nameElement = this.elementRef.nativeElement.querySelector('.interactive-name');
    if (nameElement) {
      // Agregar clase para transición lenta de retorno
      nameElement.classList.add('returning');

      // Resetear transformación con transición suave
      nameElement.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateZ(0)';
      nameElement.style.setProperty('--glow-x', '-150%');
    }
  }
}
