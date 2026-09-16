import { Component, inject, OnInit, AfterViewInit, ElementRef, HostListener } from '@angular/core';
import { PlayBtnComponent } from '../../components/play-btn/play-btn.component';
import { SideNavService } from '../../services/side-nav.service';
import { HeroCover, HeroThemeService } from '../../services/hero-theme.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-principal',
    imports: [
        PlayBtnComponent,
        CommonModule
    ],
    templateUrl: './principal.component.html',
    styleUrl: './principal.component.css'
})
export class PrincipalComponent implements OnInit, AfterViewInit {

  sideNavIsOpen: boolean = false;
  subscription: any;
  showReel: boolean = false;

  readonly heroTheme = inject(HeroThemeService);
  readonly heroWidths: readonly number[] = [960, 1920, 3200];
  readyCover: HeroCover | null = null;

  constructor(private elementRef: ElementRef) { }

  sideNavService = inject(SideNavService);

  ngOnInit(): void {
    this.sideNavService.isOpen$.subscribe(isOpen => {
      this.sideNavIsOpen = isOpen;
    });
  }

  ngAfterViewInit(): void {
    this.revealIfCached();
  }

  onCoverLoad(cover: HeroCover): void {
    if (cover === this.heroTheme.currentCover()) {
      this.readyCover = cover;
    }
  }

  /** Devuelve el srcset responsivo (960/1920/3200w) para una cubierta del hero. */
  coverSrcset(key: string): string {
    return this.heroWidths
      .map(width => `assets/images/hero/${key}-${width}.webp ${width}w`)
      .join(', ');
  }

  /** Fallback para navegadores sin soporte de srcset. */
  coverSrc(key: string): string {
    return `assets/images/hero/${key}-1920.webp`;
  }

  private revealIfCached(): void {
    const img = this.elementRef.nativeElement.querySelector('img.hero-cover') as HTMLImageElement | null;
    const cover = this.heroTheme.currentCover();
    const src = img?.currentSrc || img?.src || '';
    if (img?.complete && img.naturalWidth > 0 && src.includes(cover)) {
      this.readyCover = cover;
    }
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
