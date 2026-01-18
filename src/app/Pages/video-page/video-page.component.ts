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
  standalone: true,
  imports: [NgFor],
  templateUrl: './video-page.component.html',
  styleUrl: './video-page.component.css'
})
export class VideoPageComponent {
  private sanitizer = inject(DomSanitizer);

  scenes: Scene[] = [
    {
      videoId: '989002249',
      hash: '87574a8f82',
      title: 'Escena de Pilar Blanco - Actuación dramática 1',
      projectName: 'Pecadores de la Pradera',
      visible: true
    },
    {
      videoId: '1102753806',
      hash: '7fb8fd176a',
      title: 'Escena de Pilar Blanco - Actuación dramática 2',
      projectName: 'Aquella Fotografía',
      visible: true
    },
    {
      videoId: '782842299',
      hash: '03d9fc9437',
      title: 'Escena de Pilar Blanco - Actuación en cine 2',
      projectName: 'Proyecto 3',
      visible: false
    },
    {
      videoId: '715326695',
      hash: '65d780d64c',
      title: 'Escena de Pilar Blanco - Actuación profesional 3',
      projectName: 'El Mix',
      visible: true
    },
    {
      videoId: '992051712',
      hash: '629cbcb15e',
      title: 'Escena de Pilar Blanco - Trabajo audiovisual 4',
      projectName: 'Proyecto 5',
      visible: false
    }
  ];

  getSafeUrl(videoId: string, hash: string): SafeResourceUrl {
    const url = `https://player.vimeo.com/video/${videoId}?h=${hash}`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
