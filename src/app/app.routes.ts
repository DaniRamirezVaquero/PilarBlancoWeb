import { Routes } from '@angular/router';
import { PrincipalComponent } from './Pages/principal/principal.component';
import { VideoPageComponent } from './Pages/video-page/video-page.component';
import { GalleryPageComponent } from './Pages/gallery-page/gallery-page.component';
import { VoicePageComponent } from './Pages/voice-page/voice-page.component';
import { BioPageComponent } from './Pages/bio-page/bio-page.component';
import { CVPageComponent } from './Pages/cv-page/cv-page.component';
import { SEO_PAGES } from './seo/seo.data';

export const routes: Routes = [
  {
    path: 'home',
    component: PrincipalComponent,
    title: SEO_PAGES['/home'].title,
  },
  {
    path: 'video',
    component: VideoPageComponent,
    title: SEO_PAGES['/video'].title,
  },
  {
    path: 'gallery',
    component: GalleryPageComponent,
    title: SEO_PAGES['/gallery'].title,
  },
  {
    path: 'voice',
    component: VoicePageComponent,
    title: SEO_PAGES['/voice'].title,
  },
  {
    path: 'bio',
    component: BioPageComponent,
    title: SEO_PAGES['/bio'].title,
  },
  {
    path: 'curriculum',
    component: CVPageComponent,
    title: SEO_PAGES['/curriculum'].title,
  },
  {
    path: '', redirectTo: '/home', pathMatch: 'full'
  }
];
