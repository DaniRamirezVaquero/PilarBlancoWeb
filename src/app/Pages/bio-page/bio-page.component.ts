import { RevealDirective } from '../../directives/reveal.directive';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../../components/icon/icon.component';

@Component({
    selector: 'app-bio-page',
    imports: [RouterLink, IconComponent, RevealDirective],
    templateUrl: './bio-page.component.html',
    styleUrl: './bio-page.component.css'
})
export class BioPageComponent {

}
