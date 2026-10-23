import { Component } from '@angular/core';
import { ContactSheetComponent } from '../../components/contact-sheet/contact-sheet.component';
import { IconComponent } from '../../components/icon/icon.component';
import { BOOK, CONTACT, PROJECTS } from '../../data/portfolio.data';

@Component({
    selector: 'app-gallery-page',
    imports: [ContactSheetComponent, IconComponent],
    templateUrl: './gallery-page.component.html',
    styleUrl: './gallery-page.component.css'
})
export class GalleryPageComponent {
  readonly book = BOOK;
  readonly projects = PROJECTS;
  readonly photosZip = CONTACT.photosZip;
}
