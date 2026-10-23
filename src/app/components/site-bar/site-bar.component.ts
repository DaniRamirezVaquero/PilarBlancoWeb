import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IconComponent } from '../icon/icon.component';
import { ContactMenuComponent } from '../contact-menu/contact-menu.component';
import { CONTACT } from '../../data/portfolio.data';

interface NavItem {
  label: string;
  link: string;
  /** Dirección del material en el rollo del inicio. */
  code: string;
}

/**
 * Barra superior: el membrete de la hoja de contactos. Nombre, direcciones de
 * fotograma hacia cada página, contacto y descarga del CV siempre a mano.
 */
@Component({
  selector: 'app-site-bar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, IconComponent, ContactMenuComponent],
  templateUrl: './site-bar.component.html',
  styleUrl: './site-bar.component.css',
  host: {
    '(document:keydown.escape)': 'closeMenu()',
  },
})
export class SiteBarComponent {
  readonly nav: NavItem[] = [
    { label: 'Vídeos', link: '/video', code: '05A' },
    { label: 'Fotos', link: '/gallery', code: '06A' },
    { label: 'Voz', link: '/voice', code: '18A' },
    { label: 'Currículum', link: '/curriculum', code: '22A' },
    { label: 'Sobre mí', link: '/bio', code: '23A' },
  ];

  readonly cvUrl = CONTACT.cv;
  readonly menuOpen = signal(false);

  toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }
}
