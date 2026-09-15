import { Component, inject, OnInit, OnDestroy, AfterViewInit, ElementRef, HostListener } from '@angular/core';
import { PlayBtnComponent } from '../../components/play-btn/play-btn.component';
import { SideNavService } from '../../services/side-nav.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-principal',
  standalone: true,
  imports: [
    PlayBtnComponent,
    CommonModule,
    RouterLink
  ],
  templateUrl: './principal.component.html',
  styleUrl: './principal.component.css'
})
export class PrincipalComponent implements OnInit, AfterViewInit, OnDestroy {

  sideNavIsOpen: boolean = false;
  subscription: any;
  showReel: boolean = false;

  readonly covers: string[] = [
    'assets/images/Fondo2.jpg',
    'assets/images/Portada.jpg'
  ];
  currentCoverIndex = 0;
  coversAnimated = false;

  private readonly coverIntervalMs = 30 * 60 * 1000;
  private coverTimeoutId: ReturnType<typeof setTimeout> | null = null;
  private coverIntervalId: ReturnType<typeof setInterval> | null = null;

  constructor(private elementRef: ElementRef) { }

  sideNavService = inject(SideNavService);

  ngOnInit(): void {
    this.sideNavService.isOpen$.subscribe(isOpen => {
      this.sideNavIsOpen = isOpen;
    });

    this.currentCoverIndex = Math.floor(Date.now() / this.coverIntervalMs) % this.covers.length;
    if (typeof Image !== 'undefined') {
      this.preloadCovers();
      this.scheduleCoverRotation();
    }
  }

  ngAfterViewInit(): void {
    if (typeof requestAnimationFrame === 'undefined') {
      return;
    }
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        this.coversAnimated = true;
      });
    });
  }

  ngOnDestroy(): void {
    if (this.coverTimeoutId) {
      clearTimeout(this.coverTimeoutId);
    }
    if (this.coverIntervalId) {
      clearInterval(this.coverIntervalId);
    }
  }

  private preloadCovers(): void {
    this.covers.forEach(src => {
      const image = new Image();
      image.src = src;
    });
  }

  private scheduleCoverRotation(): void {
    const remainingMs = this.coverIntervalMs - (Date.now() % this.coverIntervalMs);

    this.coverTimeoutId = setTimeout(() => {
      this.advanceCover();
      this.coverIntervalId = setInterval(() => this.advanceCover(), this.coverIntervalMs);
    }, remainingMs);
  }

  private advanceCover(): void {
    this.currentCoverIndex = (this.currentCoverIndex + 1) % this.covers.length;
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
