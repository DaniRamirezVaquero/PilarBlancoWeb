import { RevealDirective } from '../../directives/reveal.directive';
import { Component } from '@angular/core';
import { VoiceStripComponent } from '../../components/voice-strip/voice-strip.component';
import { VimeoFacadeComponent } from '../../components/vimeo-facade/vimeo-facade.component';
import { DUBBING, VOICE } from '../../data/portfolio.data';

@Component({
    selector: 'app-voice-page',
    imports: [VoiceStripComponent, VimeoFacadeComponent, RevealDirective],
    templateUrl: './voice-page.component.html',
    styleUrls: ['./voice-page.component.css']
})
export class VoicePageComponent {
  readonly voice = VOICE;
  readonly dubbing = DUBBING;
}
