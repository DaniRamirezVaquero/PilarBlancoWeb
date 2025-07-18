import { Component, OnInit } from '@angular/core';
import { CassetteComponent } from '../../components/cassette/cassette.component';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-voice-page',
  standalone: true,
  imports: [CassetteComponent],
  templateUrl: './voice-page.component.html',
  styleUrls: ['./voice-page.component.css']
})
export class VoicePageComponent implements OnInit {

  constructor(private seoService: SeoService) { }

  ngOnInit(): void {
    this.seoService.updatePageSeo({
      title: 'Voz - Pilar Blanco | Doblaje y Locución Profesional',
      description: 'Descubre el trabajo de Pilar Blanco en doblaje y locución. Escucha sus demos profesionales y conoce su experiencia en radio y proyectos audiovisuales.',
      keywords: 'Pilar Blanco doblaje, locución, voz actriz, demos voz, radio, Cadena Ser, A vivir que son dos días, narrator, voice over',
      ogImage: 'https://pilarblanco.com/assets/images/pilar-blanco-voice.jpg',
      canonicalUrl: 'https://pilarblanco.com/voice'
    });
  }
}
