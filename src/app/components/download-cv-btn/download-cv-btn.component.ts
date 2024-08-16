import { Component } from '@angular/core';

@Component({
  selector: 'app-download-cv-btn',
  standalone: true,
  imports: [],
  templateUrl: './download-cv-btn.component.html',
  styleUrl: './download-cv-btn.component.css'
})
export class DownloadCvBtnComponent {

  constructor() { }

  downloadCv() {
    const link = document.createElement('a');
    link.href = 'assets/CV.pdf';
    link.download = 'CV.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
