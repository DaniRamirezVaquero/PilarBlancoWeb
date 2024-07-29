import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { BurguerMenuBtnComponent } from '../burguer-menu-btn/burguer-menu-btn.component';
import { SideNavService } from '../../services/side-nav.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-side-navigation',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    BurguerMenuBtnComponent,
    CommonModule
  ],
  templateUrl: './side-navigation.component.html',
  styleUrl: './side-navigation.component.css'
})
export class SideNavigationComponent {

  isOpen = false;

  sideNavService = inject(SideNavService);

  toggleSideNav() {
    const sideNav = document.getElementById('sideNav');

    if (sideNav !== null) {
      if (this.isOpen) {
        sideNav.style.left = '-460px';
      } else {
        sideNav.style.left = '0';
      }
      this.isOpen = !this.isOpen;
      this.sideNavService.setIsOpen(this.isOpen);

    }
  }
}
