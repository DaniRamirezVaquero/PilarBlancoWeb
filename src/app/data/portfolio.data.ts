/**
 * Material real de Pilar Blanco compartido por el inicio y las páginas propias.
 * Cada pieza conserva un código corto («06A», «18A»…) que sirve de clave estable.
 */

export interface Frame {
  /** Clave corta de la foto, p. ej. «07A». */
  code: string;
  /** Imagen para la copia pequeña (hilera o muro). */
  src: string;
  srcset?: string;
  /** Imagen grande para la lupa y la ampliación. */
  full: string;
  alt: string;
  /**
   * Encuadre de la copia pequeña (CSS object-position) cuando la foto no tiene
   * su proporción (4:5); por defecto, centrado.
   */
  position?: string;
  /** Rótulo opcional (título del proyecto en la hoja de proyectos). */
  caption?: string;
}

export interface Video {
  code: string;
  videoId: string;
  hash: string;
  /**
   * Póster en alta resolución (CDN de Vimeo, ~1920px), obtenido con:
   * curl "https://vimeo.com/api/oembed.json?url=https://vimeo.com/<id>&width=1920"
   * Regenerar si Vimeo cambia el fotograma de portada del vídeo.
   */
  poster: string;
  title: string;
  label: string;
}

export interface VoiceDemo {
  code: string;
  label: string;
  url: string;
  /** Duración en segundos. */
  duration: number;
  /**
   * Picos de amplitud (0–100) en 96 tramos, medidos del propio MP3 con
   * decodeAudioData: dibujan la forma de onda de cada demo.
   */
  peaks: number[];
}

export interface Credit {
  title: string;
  by: string;
  url?: string;
  note?: string;
}

const pad = (n: number) => `${String(n).padStart(2, '0')}A`;

/** Clave a partir de la posición de la pieza en su lista. */
export const frameCode = pad;

function book(n: number, alt: string, code: string): Frame {
  const base = `assets/images/carousel/Pilar Blanco WEB_${n}`;
  // En srcset los espacios separan candidatos: el nombre del fichero va codificado.
  const encoded = base.replace(/ /g, '%20');
  return {
    code,
    src: `${base}-900.webp`,
    srcset: `${encoded}-900.webp 900w, ${encoded}-1400.webp 1400w`,
    full: `${base}-1400.webp`,
    alt,
    // Si la copia pequeña recorta la foto, se conserva la cabeza antes que los pies.
    position: '50% 20%',
  };
}

export const COVER: Frame = {
  code: '02A',
  src: 'assets/images/hero/portada-960.webp',
  srcset: 'assets/images/hero/portada-960.webp 960w, assets/images/hero/portada-1920.webp 1920w',
  full: 'assets/images/hero/portada-1920.webp',
  alt: 'Pilar Blanco, actriz, sentada sobre un baúl metálico con camisa blanca y vaqueros',
  // La portada es apaisada (16:9): en una copia vertical se encuadra sobre ella, no sobre el fondo.
  position: '66% 40%',
};

/** Book fotográfico (descargable en zip). */
export const BOOK: Frame[] = [
  [1, 'Pilar Blanco, actriz, de pie con camiseta negra en book fotográfico'],
  [2, 'Pilar Blanco, actriz, en retrato de book fotográfico'],
  [3, 'Pilar Blanco, actriz, posando en sesión de book'],
  [4, 'Pilar Blanco, actriz, sentada en un taburete con ropa negra'],
  [5, 'Pilar Blanco, actriz, en retrato artístico de galería'],
  [6, 'Pilar Blanco, actriz, de pie con camisa blanca y vaqueros'],
  [7, 'Pilar Blanco, actriz, en fotografía de book promocional'],
  [8, 'Pilar Blanco, actriz, en retrato de carácter'],
  [9, 'Pilar Blanco, actriz, en sesión fotográfica de galería'],
  [10, 'Pilar Blanco, actriz, en retrato de book en color'],
  [11, 'Pilar Blanco, actriz, en fotografía de galería web'],
  [12, 'Pilar Blanco, actriz, sentada en un baúl en book fotográfico'],
].map(([n, alt], i) => book(n as number, alt as string, pad(6 + i)));

/**
 * Sesión del inicio y de la galería. La portada anterior (apaisada) va segunda:
 * el book abre con una foto vertical, que es la que llena el escenario.
 */
export const SESSION: Frame[] = [BOOK[0], COVER, ...BOOK.slice(1)];

const PROJECT_TITLES = [
  'Violencias periféricas', 'El don', 'Pecadores de la pradera', 'Medac', 'Pediofobia',
  'Aquella fotografía', 'Lumon', 'Más allá de lo común', 'Disonancias', 'Lo que esconde el tarot',
  'Apogeo', 'Por las nubes', 'Petit à petit', 'Rey gitano', 'Gloria y Candela',
  'Una lamentable pérdida', 'No soy tu madre', 'Libres al fin', 'Cronos', 'Blurry eyes',
  'Ciel sans lune', 'El anfitrión', 'Calibre 55', 'Calibre 55', 'Quantum',
  'Croma 11', 'Abro los ojos, sueño contigo', 'Pablo Escolar', 'Sin noticias de Gurb', 'Rabia',
  'Alice', 'Espacio Alzheimer Andalucía', 'Espacio Alzheimer Andalucía', 'Espacio Alzheimer Andalucía', 'Darkinside',
];

/** Fotogramas de proyectos (muro de la galería): el título va como pie de foto. */
export const PROJECTS: Frame[] = PROJECT_TITLES.map((title, i) => {
  // Los «-900» son versiones recomprimidas (~900px) de los originales, que superaban los 700 KB.
  const src = `assets/images/collage/FOTO (${i + 1})-900.webp`;
  return {
    code: pad(i + 1),
    src,
    full: src,
    alt: `Pilar Blanco, actriz, en el proyecto ${title}`,
    caption: title,
  };
});

export const REEL: Video = {
  code: '05A',
  videoId: '1208363473',
  hash: '3205afba43',
  poster: 'https://i.vimeocdn.com/video/2178138818-07a33c9c1b4410bb82955e868006a6fb428747ed8c4a33fad425ca3fafa70081-d_1920?region=us',
  title: 'Reel 2026 de actuación de Pilar Blanco',
  label: 'Reel 2026',
};

export const SCENES: Video[] = [
  {
    code: '01A',
    videoId: '1209481513',
    hash: '87a2889eae',
    poster: 'https://i.vimeocdn.com/video/2179087859-fccba4bd88ce0755aad487c28128a5a503d9a9e7712de8917533dacc5ced6a37-d_1920?region=us',
    title: 'Videobook Express de Pilar Blanco',
    label: 'Videobook Express',
  },
  {
    code: '02A',
    videoId: '786041466',
    hash: '5428a890c9',
    poster: 'https://i.vimeocdn.com/video/2044755913-e9ba303078648b918f4c1f30af109af6d5647c7b3b882e948afa3b367a4c8179-d_1920?region=us',
    title: 'Reel de actuación de Pilar Blanco',
    label: 'Reel anterior',
  },
  {
    code: '03A',
    videoId: '989002249',
    hash: '87574a8f82',
    poster: 'https://i.vimeocdn.com/video/1904703899-e4f44c7ca25f1d6db1bfb199ca45e84292c28a1c5fbe95cdf170d1439a4bfab1-d_1920?region=us',
    title: 'Escena de Pilar Blanco - Pecadores de la Pradera',
    label: 'Pecadores de la pradera',
  },
];

export const DUBBING: Video[] = [
  {
    code: '01A',
    videoId: '715325007',
    hash: '030a97a869',
    poster: 'https://i.vimeocdn.com/video/1441720619-5fd0a1f74b3eb2e2f9de40ac3b35bb8d9f6f493d80d97b69fb95e982e9fe18ff-d_1920?region=us',
    title: 'Demo de doblaje de Pilar Blanco',
    label: 'Demo de doblaje 1',
  },
  {
    code: '02A',
    videoId: '994004071',
    hash: '93da72042a',
    poster: 'https://i.vimeocdn.com/video/1910003369-91899f3ad7db92b17e227f1bc2c828c30015f204277ec6f55bbab8d968e48de8-d_1920?region=us',
    title: 'Demo de doblaje de Pilar Blanco',
    label: 'Demo de doblaje 2',
  },
];

/** Demos de locución (MP3). */
export const VOICE: VoiceDemo[] = [
  {
    code: '18A', label: 'Publicidad', url: 'assets/tapes/Demo2.mp3', duration: 28,
    peaks: [0,0,72,45,58,66,57,49,28,57,52,31,93,40,25,0,57,33,60,62,61,55,44,47,40,29,0,40,52,69,81,61,50,60,62,70,56,65,62,61,19,71,58,61,66,26,51,71,64,52,51,59,0,0,59,48,61,100,44,41,0,0,94,55,16,54,62,58,49,35,17,0,83,63,61,50,58,41,13,0,57,74,43,0,0,0,74,46,49,37,45,8,0,0,0,0],
  },
  {
    code: '19A', label: 'Demo 3', url: 'assets/tapes/Demo3.mp3', duration: 46,
    peaks: [71,63,57,38,35,38,39,40,33,2,62,50,38,35,17,40,49,55,54,29,36,46,45,21,35,40,36,58,20,43,23,0,58,47,41,52,43,43,37,54,41,51,14,100,51,66,54,42,39,43,35,53,66,24,0,58,58,47,41,43,34,67,35,79,81,52,41,0,55,35,45,50,13,49,32,42,49,33,46,35,10,0,54,46,46,37,12,63,60,43,49,44,52,54,29,20],
  },
  {
    code: '20A', label: 'Demo 4', url: 'assets/tapes/Demo4.mp3', duration: 28,
    peaks: [0,1,0,0,100,34,47,54,48,54,34,96,30,39,16,0,0,71,42,57,31,39,23,42,44,54,48,44,53,35,38,21,57,51,28,29,37,31,18,1,1,1,42,86,36,13,80,70,65,52,59,47,48,49,60,44,40,49,43,42,1,1,1,64,36,49,52,29,14,1,53,33,42,45,39,32,31,33,14,0,67,37,58,38,30,44,38,36,7,0,0,0,0,0,0,0],
  },
  {
    code: '21A', label: 'Demo Málaga', url: 'assets/tapes/PILAR BLANCO_MÁLAGA - Demo 4.mp3', duration: 38,
    peaks: [1,1,1,97,94,84,65,62,49,62,69,69,70,57,31,95,47,50,18,1,28,97,54,57,59,81,70,58,54,48,70,96,73,40,31,58,81,78,99,51,64,30,1,1,0,0,98,99,60,64,30,98,93,71,86,86,68,90,86,82,55,35,54,19,78,63,99,63,37,51,1,1,36,66,77,76,96,70,65,72,76,62,99,100,78,36,45,33,49,53,40,20,0,0,1,0],
  },
];

/** Créditos destacados en el inicio; el CV completo vive en /curriculum. */
export const HIGHLIGHT_CREDITS: Credit[] = [
  { title: 'Quién llorará por mí', by: 'Paco Izquierdo', url: 'https://www.facebook.com/share/v/151JSUmSu32/', note: 'Largometraje' },
  { title: 'Entre bestias', by: 'Samcreta', url: 'https://youtu.be/AR6yYXrACM8', note: 'Largometraje' },
  { title: 'Rey gitano', by: 'Juanma Bajo Ulloa', url: 'https://youtu.be/dAwXA1BqsD4', note: 'Largometraje' },
  { title: 'Por las nubes', by: 'Fernando Colomo', url: 'https://youtu.be/Q6LxQ0mGF2o', note: 'Mediometraje' },
  { title: 'Rabia', by: 'Mediaset España', note: 'Televisión' },
  { title: 'Repris', by: 'Cía. Metronomoteatro', note: 'Teatro' },
];

export const CONTACT = {
  email: 'pilarblanco.actriz@gmail.com',
  instagram: 'https://www.instagram.com/pilarblanco.actriz/',
  vimeo: 'https://vimeo.com/user18148957',
  photosZip: 'assets/downloads/pilar-blanco-galeria-fotos.zip',
  cv: 'assets/CV.pdf',
};
