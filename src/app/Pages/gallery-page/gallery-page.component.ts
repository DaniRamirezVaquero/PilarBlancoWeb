import { Component } from '@angular/core';
import { CarouselComponent } from '../../components/carousel/carousel.component';
import { CollageComponent } from '../../components/collage/collage.component';

@Component({
  selector: 'app-gallery-page',
  standalone: true,
  imports: [
    CarouselComponent,
    CollageComponent
  ],
  templateUrl: './gallery-page.component.html',
  styleUrl: './gallery-page.component.css'
})
export class GalleryPageComponent {

}
