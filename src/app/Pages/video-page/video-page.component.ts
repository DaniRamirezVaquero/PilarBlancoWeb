import { Component } from '@angular/core';
import { NgFor } from '@angular/common';
import { VimeoFacadeComponent } from '../../components/vimeo-facade/vimeo-facade.component';

interface Scene {
  videoId: string;
  hash: string;
  /**
   * Póster en alta resolución (CDN de Vimeo, ~1920px), obtenido con:
   * curl "https://vimeo.com/api/oembed.json?url=https://vimeo.com/<id>&width=1920"
   * Regenerar si Vimeo cambia el fotograma de portada del vídeo.
   */
  poster: string;
  title: string;
  projectName: string;
  visible: boolean;
}

@Component({
    selector: 'app-video-page',
    imports: [NgFor, VimeoFacadeComponent],
    templateUrl: './video-page.component.html',
    styleUrl: './video-page.component.css'
})
export class VideoPageComponent {
  scenes: Scene[] = [
    {
      videoId: '1209481513',
      hash: '87a2889eae',
      poster: 'https://i.vimeocdn.com/video/2179087859-fccba4bd88ce0755aad487c28128a5a503d9a9e7712de8917533dacc5ced6a37-d_1920?region=us',
      title: 'Videobook Express de Pilar Blanco',
      projectName: 'Videobook Express',
      visible: true
    },
    {
      videoId: '786041466',
      hash: '5428a890c9',
      poster: 'https://i.vimeocdn.com/video/2044755913-e9ba303078648b918f4c1f30af109af6d5647c7b3b882e948afa3b367a4c8179-d_1920?region=us',
      title: 'Reel de actuación de Pilar Blanco',
      projectName: 'Reel',
      visible: true
    },
    {
      videoId: '989002249',
      hash: '87574a8f82',
      poster: 'https://i.vimeocdn.com/video/1904703899-e4f44c7ca25f1d6db1bfb199ca45e84292c28a1c5fbe95cdf170d1439a4bfab1-d_1920?region=us',
      title: 'Escena de Pilar Blanco - Pecadores de la Pradera',
      projectName: 'Pecadores de la Pradera',
      visible: true
    }
  ];
}
