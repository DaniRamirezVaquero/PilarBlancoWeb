import { Component } from '@angular/core';
import { CassetteComponent } from '../../components/cassette/cassette.component';
import { VimeoFacadeComponent } from '../../components/vimeo-facade/vimeo-facade.component';

@Component({
    selector: 'app-voice-page',
    imports: [CassetteComponent, VimeoFacadeComponent],
    templateUrl: './voice-page.component.html',
    styleUrls: ['./voice-page.component.css']
})
export class VoicePageComponent {

}
