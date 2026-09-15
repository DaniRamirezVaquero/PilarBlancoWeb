export const SITE_NAME = 'Pilar Blanco';
export const DEFAULT_OG_IMAGE_PATH = '/assets/images/og-pilar-blanco.webp';
export const DEFAULT_OG_IMAGE_ALT = 'Retrato de Pilar Blanco, actriz';

export interface SeoPage {
  path: string;
  title: string;
  description: string;
  breadcrumb: string;
  ogType?: 'website' | 'profile';
}

export const SEO_PAGES: Record<string, SeoPage> = {
  '/home': {
    path: '/home',
    title: 'Pilar Blanco | Actriz',
    description:
      'Pilar Blanco, actriz de cine, televisión, teatro y doblaje. Reel, galería, currículum y contacto para castings y agencias.',
    breadcrumb: 'Inicio',
    ogType: 'profile',
  },
  '/video': {
    path: '/video',
    title: 'Reel y videobook de Pilar Blanco | Actriz',
    description:
      'Reel 2026, videobook y escenas de Pilar Blanco. Material de actuación para directores de casting y agencias.',
    breadcrumb: 'Videos',
  },
  '/gallery': {
    path: '/gallery',
    title: 'Galería y proyectos de Pilar Blanco | Actriz',
    description:
      'Book fotográfico y fotogramas de proyectos de Pilar Blanco: cine, series, cortometrajes y publicidad.',
    breadcrumb: 'Galería',
  },
  '/voice': {
    path: '/voice',
    title: 'Doblaje y locución de Pilar Blanco | Actriz',
    description:
      'Demos de doblaje y locución de Pilar Blanco. Voz para publicidad, doblaje y proyectos audiovisuales.',
    breadcrumb: 'Voz',
  },
  '/bio': {
    path: '/bio',
    title: 'Sobre Pilar Blanco | Actriz',
    description:
      'Biografía de Pilar Blanco, actriz con trayectoria en teatro, cine, televisión, doblaje y locución.',
    breadcrumb: 'Sobre mí',
  },
  '/curriculum': {
    path: '/curriculum',
    title: 'Currículum de Pilar Blanco | Actriz',
    description:
      'Currículum artístico de Pilar Blanco: cine, televisión, teatro, cortometrajes, doblaje y formación.',
    breadcrumb: 'Currículum',
  },
  '/contact': {
    path: '/contact',
    title: 'Contacto de Pilar Blanco | Actriz',
    description:
      'Contacta con Pilar Blanco o su representante en OK Agencia para castings, agencias y proyectos audiovisuales.',
    breadcrumb: 'Contacto',
  },
};

export const PERSON_KNOWS_ABOUT = [
  'Actuación',
  'Cine',
  'Televisión',
  'Teatro',
  'Doblaje',
  'Locución',
];

export const PERSON_SAME_AS = [
  'https://www.instagram.com/pilarblanco.actriz/',
  'https://vimeo.com/user18148957',
  'https://okagencia.com/ficha.php?idactor=2133&gr=aa',
];

export const PERSON_DESCRIPTION =
  'Pilar Blanco es actriz de cine, televisión, teatro y doblaje. Inició su carrera en Metronomoteatro y ha trabajado en largometrajes, series, cortometrajes, publicidad, locución y formación ante la cámara.';
