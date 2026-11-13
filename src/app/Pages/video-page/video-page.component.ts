import { Component } from '@angular/core';
import { VimeoFacadeComponent } from '../../components/vimeo-facade/vimeo-facade.component';
import { REEL, SCENES, Video } from '../../data/portfolio.data';
import { slugify } from '../../utils/slug';

@Component({
    selector: 'app-video-page',
    imports: [VimeoFacadeComponent],
    templateUrl: './video-page.component.html',
    styleUrl: './video-page.component.css'
})
export class VideoPageComponent {
  readonly reel = REEL;
  readonly scenes = SCENES;

  sceneSlug(scene: Video): string {
    return slugify(scene.label);
  }
}
