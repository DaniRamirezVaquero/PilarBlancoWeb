import { Routes } from '@angular/router';
import { PrincipalComponent } from './Pages/principal/principal.component';
import { SEO_PAGES } from './seo/seo.data';

// Solo /home (destino de "") se importa de forma estática: es la ruta de aterrizaje
// y su componente debe estar disponible en el bundle principal sin una descarga extra.
// El resto de rutas se cargan de forma perezosa (loadComponent) para no arrastrar
// su HTML/CSS/lógica (galería, vídeos, etc.) al bundle inicial de cualquier página.
export const routes: Routes = [
  {
    path: 'home',
    component: PrincipalComponent,
    title: SEO_PAGES['/home'].title,
  },
  {
    path: 'video',
    loadComponent: () => import('./Pages/video-page/video-page.component').then(m => m.VideoPageComponent),
    title: SEO_PAGES['/video'].title,
  },
  {
    path: 'gallery',
    loadComponent: () => import('./Pages/gallery-page/gallery-page.component').then(m => m.GalleryPageComponent),
    title: SEO_PAGES['/gallery'].title,
  },
  {
    path: 'voice',
    loadComponent: () => import('./Pages/voice-page/voice-page.component').then(m => m.VoicePageComponent),
    title: SEO_PAGES['/voice'].title,
  },
  {
    path: 'bio',
    loadComponent: () => import('./Pages/bio-page/bio-page.component').then(m => m.BioPageComponent),
    title: SEO_PAGES['/bio'].title,
  },
  {
    path: 'curriculum',
    loadComponent: () => import('./Pages/cv-page/cv-page.component').then(m => m.CVPageComponent),
    title: SEO_PAGES['/curriculum'].title,
  },
  {
    path: '', redirectTo: '/home', pathMatch: 'full'
  }
];
