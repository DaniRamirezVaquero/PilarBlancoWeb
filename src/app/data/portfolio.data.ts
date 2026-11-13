/**
 * Material real de Pilar Blanco compartido por la home y las páginas propias.
 */

export interface Video {
  videoId: string;
  hash: string;
  /**
   * Póster guardado: solo se usa si /api/vimeo-poster falla (dev local o Vimeo caído).
   * La carátula real se resuelve en vivo.
   */
  fallbackPoster: string;
  title: string;
  label: string;
}

export interface VoiceDemo {
  label: string;
  url: string;
  /** Duración en segundos. */
  duration: number;
  /**
   * Picos de amplitud (0–100) en 96 tramos, medidos del propio MP3 con
   * decodeAudioData: dibujan la forma de onda de la pista.
   */
  peaks: number[];
}

export interface Credit {
  title: string;
  by: string;
  url?: string;
  note?: string;
}

const CDN = 'https://i.vimeocdn.com/video/';

export const REEL: Video = {
  videoId: '1208363473',
  hash: '3205afba43',
  fallbackPoster: CDN + '2204158798-d99724f585f77b9a37cce5f28210792aad638d46243c647e27d03d15d087db77-d_1920?region=us',
  title: 'Reel 2026 de actuación de Pilar Blanco',
  label: 'Reel 2026',
};

export const SCENES: Video[] = [
  {
    videoId: '1209481513',
    hash: '87a2889eae',
    fallbackPoster: CDN + '2204154460-435ee2ab6ec81c1e2ed4af3431896c71ebf69e4c9d8f5330d546356c7bfaec65-d_1920?region=us',
    title: 'Videobook Express de Pilar Blanco',
    label: 'Videobook Express',
  },
  {
    videoId: '786041466',
    hash: '5428a890c9',
    fallbackPoster: CDN + '2044755913-e9ba303078648b918f4c1f30af109af6d5647c7b3b882e948afa3b367a4c8179-d_1920?region=us',
    title: 'Reel de actuación de Pilar Blanco',
    label: 'Reel anterior',
  },
  {
    videoId: '989002249',
    hash: '87574a8f82',
    fallbackPoster: CDN + '1904703899-e4f44c7ca25f1d6db1bfb199ca45e84292c28a1c5fbe95cdf170d1439a4bfab1-d_1920?region=us',
    title: 'Escena de Pilar Blanco - Pecadores de la Pradera',
    label: 'Pecadores de la pradera',
  },
];

export const DUBBING: Video[] = [
  {
    videoId: '715325007',
    hash: '030a97a869',
    fallbackPoster: CDN + '1441720619-5fd0a1f74b3eb2e2f9de40ac3b35bb8d9f6f493d80d97b69fb95e982e9fe18ff-d_1920?region=us',
    title: 'Demo de doblaje de Pilar Blanco',
    label: 'Demo de doblaje 1',
  },
  {
    videoId: '994004071',
    hash: '93da72042a',
    fallbackPoster: CDN + '1910003369-91899f3ad7db92b17e227f1bc2c828c30015f204277ec6f55bbab8d968e48de8-d_1920?region=us',
    title: 'Demo de doblaje de Pilar Blanco',
    label: 'Demo de doblaje 2',
  },
];

/** Demos de locución, en este orden. Los picos se midieron del propio MP3. */
export const VOICE: VoiceDemo[] = [
  {
    label: 'Demo Publicidad', url: 'assets/tapes/Demo2.mp3', duration: 28,
    peaks: [0,0,72,45,58,66,57,49,28,57,52,31,93,40,25,0,57,33,60,62,61,55,44,47,40,29,0,40,52,69,81,61,50,60,62,70,56,65,62,61,19,71,58,61,66,26,51,71,64,52,51,59,0,0,59,48,61,100,44,41,0,0,94,55,16,54,62,58,49,35,17,0,83,63,61,50,58,41,13,0,57,74,43,0,0,0,74,46,49,37,45,8,0,0,0,0],
  },
  {
    label: 'Demo 1', url: 'assets/tapes/Demo3.mp3', duration: 46,
    peaks: [71,63,57,38,35,38,39,40,33,2,62,50,38,35,17,40,49,55,54,29,36,46,45,21,35,40,36,58,20,43,23,0,58,47,41,52,43,43,37,54,41,51,14,100,51,66,54,42,39,43,35,53,66,24,0,58,58,47,41,43,34,67,35,79,81,52,41,0,55,35,45,50,13,49,32,42,49,33,46,35,10,0,54,46,46,37,12,63,60,43,49,44,52,54,29,20],
  },
  {
    label: 'Demo 2', url: 'assets/tapes/Demo4.mp3', duration: 28,
    peaks: [0,1,0,0,100,34,47,54,48,54,34,96,30,39,16,0,0,71,42,57,31,39,23,42,44,54,48,44,53,35,38,21,57,51,28,29,37,31,18,1,1,1,42,86,36,13,80,70,65,52,59,47,48,49,60,44,40,49,43,42,1,1,1,64,36,49,52,29,14,1,53,33,42,45,39,32,31,33,14,0,67,37,58,38,30,44,38,36,7,0,0,0,0,0,0,0],
  },
  {
    label: 'Demo 3', url: 'assets/tapes/PILAR BLANCO_MÁLAGA - Demo 4.mp3', duration: 38,
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
