import { Component } from '@angular/core';

@Component({
  selector: 'app-download-bio-btn',
  standalone: true,
  imports: [],
  templateUrl: './download-bio-btn.component.html',
  styleUrl: './download-bio-btn.component.css'
})
export class DownloadBioBtnComponent {

  constructor() { }

  downloadBio() {
    const link = document.createElement('a');
    link.href = 'assets/Biography.pdf';
    link.download = 'Biography de Pilar Blanco.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
