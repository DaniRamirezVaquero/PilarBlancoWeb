import { Component } from '@angular/core';
import { IconComponent } from '../icon/icon.component';

@Component({
    selector: 'app-download-cv-btn',
    imports: [IconComponent],
    templateUrl: './download-cv-btn.component.html',
    styleUrl: './download-cv-btn.component.css'
})
export class DownloadCvBtnComponent {

  constructor() { }

  downloadCv() {
    const link = document.createElement('a');
    link.href = 'assets/CV.pdf';
    link.download = 'CV de Pilar Blanco.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
