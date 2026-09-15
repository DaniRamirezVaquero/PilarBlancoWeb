import { Component, inject } from '@angular/core';
import { NgFor } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

interface Scene {
  videoId: string;
  hash: string;
  title: string;
  projectName: string;
  visible: boolean;
}

@Component({
    selector: 'app-video-page',
    imports: [NgFor],
    templateUrl: './video-page.component.html',
    styleUrl: './video-page.component.css'
})
export class VideoPageComponent {
  private sanitizer = inject(DomSanitizer);

  scenes: Scene[] = [
    {
      videoId: '1209481513',
      hash: '87a2889eae',
      title: 'Videobook Express de Pilar Blanco',
      projectName: 'Videobook Express',
      visible: true
    },
    {
      videoId: '786041466',
      hash: '5428a890c9',
      title: 'Reel de actuación de Pilar Blanco',
      projectName: 'Reel',
      visible: true
    },
    {
      videoId: '989002249',
      hash: '87574a8f82',
      title: 'Escena de Pilar Blanco - Pecadores de la Pradera',
      projectName: 'Pecadores de la Pradera',
      visible: true
    }
  ];

  getSafeUrl(videoId: string, hash: string): SafeResourceUrl {
    const url = `https://player.vimeo.com/video/${videoId}?h=${hash}`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
