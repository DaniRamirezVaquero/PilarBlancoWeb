import { Routes } from '@angular/router';
import { PrincipalComponent } from './Pages/principal/principal.component';
import { VideoPageComponent } from './Pages/video-page/video-page.component';
import { GalleryPageComponent } from './Pages/gallery-page/gallery-page.component';
import { VoicePageComponent } from './Pages/voice-page/voice-page.component';
import { ContactPageComponent } from './Pages/contact-page/contact-page.component';
import { BioPageComponent } from './Pages/bio-page/bio-page.component';
import { CVPageComponent } from './Pages/cv-page/cv-page.component';

export const routes: Routes = [
  {
    path: 'home', component: PrincipalComponent
  },
  {
    path: 'video', component: VideoPageComponent
  },
  {
    path: 'gallery', component: GalleryPageComponent
  },
  {
    path: 'voice', component: VoicePageComponent
  },
  {
    path: 'bio', component: BioPageComponent
  },
  {
    path: 'curriculum', component: CVPageComponent
  },
  {
    path: 'contact', component: ContactPageComponent
  },
  {
    path: '', redirectTo: '/home', pathMatch: 'full'
  }
];
