import { Component } from '@angular/core';
import { SocialsComponent } from '../socials/socials.component';

@Component({
    selector: 'app-header',
    imports: [
        SocialsComponent
    ],
    templateUrl: './header.component.html',
    styleUrl: './header.component.css'
})
export class HeaderComponent {

}
