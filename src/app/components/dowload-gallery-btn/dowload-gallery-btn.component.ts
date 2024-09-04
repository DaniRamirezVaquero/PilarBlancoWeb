import { Component } from '@angular/core';

@Component({
  selector: 'app-dowload-gallery-btn',
  standalone: true,
  imports: [],
  templateUrl: './dowload-gallery-btn.component.html',
  styleUrl: './dowload-gallery-btn.component.css'
})
export class DowloadGalleryBtnComponent {

  downloadGallery() {
    const link = document.createElement('a');
    link.href = 'assets/Pilar Blanco.zip';
    link.download = 'Pilar Blanco.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
