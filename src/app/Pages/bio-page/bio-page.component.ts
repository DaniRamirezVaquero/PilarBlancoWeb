import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../../components/icon/icon.component';

@Component({
    selector: 'app-bio-page',
    imports: [RouterLink, IconComponent],
    templateUrl: './bio-page.component.html',
    styleUrl: './bio-page.component.css',
    // Lectura en la zona iluminada del fondo continuo.
    host: { class: 'ground-lit' },
})
export class BioPageComponent {

}
