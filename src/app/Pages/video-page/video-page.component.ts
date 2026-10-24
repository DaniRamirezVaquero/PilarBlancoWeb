import { Component } from '@angular/core';
import { VimeoFacadeComponent } from '../../components/vimeo-facade/vimeo-facade.component';
import { REEL, SCENES } from '../../data/portfolio.data';

@Component({
    selector: 'app-video-page',
    imports: [VimeoFacadeComponent],
    templateUrl: './video-page.component.html',
    styleUrl: './video-page.component.css',
    // Los vídeos se ven en la sombra del estudio.
    host: { class: 'ground-shade' },
})
export class VideoPageComponent {
  readonly reel = REEL;
  readonly scenes = SCENES;
}
