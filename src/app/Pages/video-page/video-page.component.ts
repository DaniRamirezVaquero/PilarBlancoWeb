import { RevealDirective } from '../../directives/reveal.directive';
import { Component } from '@angular/core';
import { VimeoFacadeComponent } from '../../components/vimeo-facade/vimeo-facade.component';
import { REEL, SCENES } from '../../data/portfolio.data';

@Component({
    selector: 'app-video-page',
    imports: [VimeoFacadeComponent, RevealDirective],
    templateUrl: './video-page.component.html',
    styleUrl: './video-page.component.css'
})
export class VideoPageComponent {
  readonly reel = REEL;
  readonly scenes = SCENES;
}
