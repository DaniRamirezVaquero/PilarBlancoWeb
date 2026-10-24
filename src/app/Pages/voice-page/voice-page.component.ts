import { Component } from '@angular/core';
import { VoiceStripComponent } from '../../components/voice-strip/voice-strip.component';
import { VimeoFacadeComponent } from '../../components/vimeo-facade/vimeo-facade.component';
import { DUBBING, VOICE } from '../../data/portfolio.data';

@Component({
    selector: 'app-voice-page',
    imports: [VoiceStripComponent, VimeoFacadeComponent],
    templateUrl: './voice-page.component.html',
    styleUrls: ['./voice-page.component.css'],
    // La voz se escucha en la sombra del estudio.
    host: { class: 'ground-shade' },
})
export class VoicePageComponent {
  readonly voice = VOICE;
  readonly dubbing = DUBBING;
}
