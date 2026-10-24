import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IconComponent } from '../icon/icon.component';
import { ContactMenuComponent } from '../contact-menu/contact-menu.component';
import { CONTACT } from '../../data/portfolio.data';

interface NavItem {
  label: string;
  link: string;
}

/**
 * Barra superior en la sombra del estudio: nombre, páginas, contacto y descarga
 * del CV siempre a mano.
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
    { label: 'Vídeos', link: '/video' },
    { label: 'Fotos', link: '/gallery' },
    { label: 'Voz', link: '/voice' },
    { label: 'Currículum', link: '/curriculum' },
    { label: 'Sobre mí', link: '/bio' },
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
