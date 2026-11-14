import { Component } from '@angular/core';
import { DownloadCvBtnComponent } from '../../components/download-cv-btn/download-cv-btn.component';
import { IconComponent } from '../../components/icon/icon.component';

interface CvCredit {
  title: string;
  /** Director, productora o compañía. */
  by?: string;
  /** Vídeo del trabajo, si está en abierto. */
  url?: string;
  /** Formato o estado, como «Mediometraje» o «En postpro»: se pinta como chip. */
  note?: string;
}

interface CvSection {
  heading: string;
  credits: CvCredit[];
}

@Component({
    selector: 'app-cvpage',
    imports: [
        DownloadCvBtnComponent,
        IconComponent,
    ],
    templateUrl: './cv-page.component.html',
    styleUrl: './cv-page.component.css'
})
export class CVPageComponent {
  readonly sections: readonly CvSection[] = [
    {
      heading: 'Largometrajes',
      credits: [
        { title: 'Quién llorará por mí', by: 'Paco Izquierdo', url: 'https://www.facebook.com/share/v/151JSUmSu32/' },
        { title: 'Entre Bestias', by: 'Samcreta', url: 'https://youtu.be/AR6yYXrACM8' },
        { title: 'Cuarzo', by: 'Danidogfilms', note: 'En postpro' },
        { title: 'El culpable, redención', note: 'En postpro' },
        { title: 'Rey gitano', by: 'Juanma Bajo Ulloa', url: 'https://youtu.be/dAwXA1BqsD4' },
        { title: 'Por las nubes', by: 'Fernando Colomo', url: 'https://youtu.be/Q6LxQ0mGF2o', note: 'Mediometraje' },
      ],
    },
    {
      heading: 'Cortometrajes',
      credits: [
        { title: 'Aquella Fotografía', by: 'Sergio Barba', url: 'https://youtu.be/wqx6g6Ste-w' },
        { title: 'Violencias Periféricas', by: 'Davinia Burgos', url: 'https://youtu.be/cqh2DzdLqPM' },
        { title: 'El penúltimo error', by: 'Enrique García' },
        { title: 'Más allá de lo común', by: 'M. Márquez y A. Vera', url: 'https://youtu.be/HWk-N5XTtBo' },
        { title: 'Gloria y Candela', by: 'Alicia Arwgar', url: 'https://youtu.be/5kZo-h2jVnM' },
        { title: 'Una lamentable pérdida', by: 'Sonia Madrid', url: 'https://youtu.be/i4EMGcJ_XFI' },
        { title: 'Apogéo', by: 'Francisco Cruzado' },
        { title: 'Disonancias', by: 'Fran Kapilla', url: 'https://youtu.be/8tMNqP8Z86Q' },
        { title: 'Petit à Petit', by: 'Sara Sanort' },
        { title: 'Croma 11', by: 'Pablo Matute' },
        { title: 'Cierro los ojos sueño contigo', by: 'Andrés Peña' },
        { title: 'Ciel sans lune', by: 'Alex Esteve', url: 'https://youtu.be/EeI-JCfGT-U', note: 'Vídeo musical' },
        { title: 'Darkinside', by: 'Andrés Peña', note: 'Serie web' },
      ],
    },
    {
      heading: 'Televisión',
      credits: [
        { title: 'Rabia', by: 'Mediaset España' },
        { title: 'Arrayán', by: 'Canal Sur' },
        { title: 'Plaza Alta', by: 'Canal Sur' },
      ],
    },
    {
      heading: 'Teatro',
      credits: [
        { title: 'Ópera Werther', by: 'Paul-Emile Fourny' },
        { title: 'Mulholand Drive La obra', by: 'Cristina Fernández' },
        { title: 'Lorca en carne viva', by: 'Teatro de la orilla' },
        { title: 'El debate', by: 'Musical Didáctico' },
        { title: 'Paseo por el siglo de oro', by: 'Musical Didáctico' },
        { title: 'Repris, El destrozo de mi cuerpo y memoria', by: 'Cía Metronomoteatro' },
      ],
    },
  ];
}
