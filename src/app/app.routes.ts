import { Routes } from '@angular/router';
import { PrincipalComponent } from './Pages/principal/principal.component';
import { VideoPageComponent } from './Pages/video-page/video-page.component';
import { GalleryPageComponent } from './Pages/gallery-page/gallery-page.component';

export const routes: Routes = [
  {
    path: 'principal', component: PrincipalComponent
  },
  {
    path: 'video', component: VideoPageComponent
  },
  {
    path: 'gallery', component: GalleryPageComponent
  },
  {
    path: '', redirectTo: '/principal', pathMatch: 'full'
  }
];
