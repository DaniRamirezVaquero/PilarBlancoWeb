import { Component } from '@angular/core';
import { CarouselComponent } from '../../components/carousel/carousel.component';
import { CollageComponent } from '../../components/collage/collage.component';
import { IconComponent } from '../../components/icon/icon.component';

@Component({
    selector: 'app-gallery-page',
    imports: [
        CarouselComponent,
        CollageComponent,
        IconComponent
    ],
    templateUrl: './gallery-page.component.html',
    styleUrl: './gallery-page.component.css'
})
export class GalleryPageComponent {

}
