import { Component } from '@angular/core';
import { BurguerMenuBtnComponent } from '../burguer-menu-btn/burguer-menu-btn.component';
import { SocialsComponent } from '../socials/socials.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    BurguerMenuBtnComponent,
    SocialsComponent
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

}
