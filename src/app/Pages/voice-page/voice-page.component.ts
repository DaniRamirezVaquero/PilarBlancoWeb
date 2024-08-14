import { Component } from '@angular/core';
import { CassetteComponent } from '../../components/cassette/cassette.component';

@Component({
  selector: 'app-voice-page',
  standalone: true,
  imports: [CassetteComponent],
  templateUrl: './voice-page.component.html',
  styleUrls: ['./voice-page.component.css']
})
export class VoicePageComponent {

}
