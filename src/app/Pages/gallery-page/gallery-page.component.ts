import { Component } from '@angular/core';
import { PhotoBookComponent } from '../../components/photo-book/photo-book.component';
import { IconComponent } from '../../components/icon/icon.component';
import { CONTACT, PROJECTS, SESSION } from '../../data/portfolio.data';

@Component({
    selector: 'app-gallery-page',
    imports: [PhotoBookComponent, IconComponent],
    templateUrl: './gallery-page.component.html',
    styleUrl: './gallery-page.component.css',
    // Lectura en la zona iluminada del fondo continuo.
    host: { class: 'ground-lit' },
})
export class GalleryPageComponent {
  readonly book = SESSION;
  readonly projects = PROJECTS;
  readonly photosZip = CONTACT.photosZip;
}
