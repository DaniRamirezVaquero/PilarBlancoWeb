import { Routes } from '@angular/router';
import { PrincipalComponent } from './Pages/principal/principal.component';
import { VideoPageComponent } from './Pages/video-page/video-page.component';

export const routes: Routes = [
  {
    path: 'principal', component: PrincipalComponent
  },
  {
    path: 'video', component: VideoPageComponent
  },
  {
    path: '', redirectTo: '/principal', pathMatch: 'full'
  }
];
