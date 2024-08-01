import { CommonModule } from '@angular/common';
import { Component, NgZone } from '@angular/core';

@Component({
  selector: 'app-collage',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './collage.component.html',
  styleUrl: './collage.component.css'
})
export class CollageComponent {

  images: string[] = [
    'assets/images/collage/FOTO (1).webp',
    'assets/images/collage/FOTO (2).webp',
    'assets/images/collage/FOTO (3).webp',
    'assets/images/collage/FOTO (4).webp',
    'assets/images/collage/FOTO (5).webp',
    'assets/images/collage/FOTO (6).webp',
    'assets/images/collage/FOTO (7).webp',
    'assets/images/collage/FOTO (8).webp',
    'assets/images/collage/FOTO (9).webp',
    'assets/images/collage/FOTO (10).webp',
    'assets/images/collage/FOTO (11).webp',
    'assets/images/collage/FOTO (12).webp',
    'assets/images/collage/FOTO (13).webp',
    'assets/images/collage/FOTO (14).webp',
    'assets/images/collage/FOTO (15).webp',
    'assets/images/collage/FOTO (16).webp',
    'assets/images/collage/FOTO (17).webp',
    'assets/images/collage/FOTO (18).webp',
    'assets/images/collage/FOTO (19).webp',
    'assets/images/collage/FOTO (20).webp',
    'assets/images/collage/FOTO (21).webp',
    'assets/images/collage/FOTO (22).webp',
    'assets/images/collage/FOTO (23).webp',
    'assets/images/collage/FOTO (24).webp',
    'assets/images/collage/FOTO (25).webp',
    'assets/images/collage/FOTO (26).webp',
    'assets/images/collage/FOTO (27).webp',
    'assets/images/collage/FOTO (28).webp',
    'assets/images/collage/FOTO (29).webp',
  ];

  titulos = [
    {index: 1, titulo: 'VIOLENCIAS PERIFÉRICAS'},
    {index: 2, titulo: 'EL DON'},
    {index: 3, titulo: 'PECADORES DE LA PRADERA'},
    {index: 4, titulo: 'MEDAC'},
    {index: 5, titulo: 'PEDIOFOBIA'},
    {index: 6, titulo: 'AQUELLA FOTOGRAFÍA'},
    {index: 7, titulo: 'LUMON'},
    {index: 8, titulo: 'MÁS ALLÁ DE LO COMÚN'},
    {index: 9, titulo: 'DISONANCIAS'},
    {index: 10, titulo: 'LO QUE ESCONDE EL TARÓ'},
    {index: 11, titulo: 'APOGEO'},
    {index: 12, titulo: 'POR LAS NUBES_FERNANDO COLOMO'},
    {index: 13, titulo: 'PETIT À PETIT'},
    {index: 14, titulo: 'REY GITANO'},
    {index: 15, titulo: 'GLORIA Y CANDELA'},
    {index: 16, titulo: 'UNA LAMENTABLE PÉRDIDA'},
    {index: 17, titulo: 'NO SOY TU MADRE'},
    {index: 18, titulo: 'LIBRES AL FIN'},
    {index: 19, titulo: 'CRONOS'},
    {index: 20, titulo: 'BLURRY EYES'},
    {index: 21, titulo: 'CIEL SANS LUNE'},
    {index: 22, titulo: 'EL ANFITRIÓN'},
    {index: 23, titulo: 'CALIBRE 55'},
    {index: 24, titulo: 'CALIBRE 55'},
    {index: 25, titulo: 'QUANTUM'},
    {index: 26, titulo: 'CROMA 11'},
    {index: 27, titulo: 'ABRO LOS OJOS SUEÑO CONTIGO'},
    {index: 28, titulo: 'PABLO ESCOLAR'},
    {index: 29, titulo: 'SIN NOTICIAS DE GURB'}
  ]

  imageGroups: string[][] = [];
  titlePosition = { x: 0, y: 0 };
  targetPosition = { x: 0, y: 0 };
  lerpSpeed = 0.1;

  constructor(private ngZone: NgZone) {}

  ngOnInit(): void {
    this.imageGroups = this.chunkArray(this.images, 7);
    this.ngZone.runOutsideAngular(() => this.animateTitle());
  }

  updateTitlePosition(event: MouseEvent) {
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    this.targetPosition.x = event.clientX - rect.left + 10; // Ajuste para evitar que el título se superponga al cursor
    this.targetPosition.y = event.clientY - rect.top + 10;  // Ajuste para evitar que el título se superponga al cursor
  }

  animateTitle() {
    this.titlePosition.x += (this.targetPosition.x - this.titlePosition.x) * this.lerpSpeed;
    this.titlePosition.y += (this.targetPosition.y - this.titlePosition.y) * this.lerpSpeed;
    requestAnimationFrame(() => this.animateTitle());
  }


  getAltText(imagePath: string): string {
    const fileName = imagePath.split('/').pop();
    return fileName ? fileName.split('.').slice(0, -1).join('.') : '';
  }

  getTitle(imagePath: string): string {
    const index = this.images.indexOf(imagePath) + 1;
    const tituloObj = this.titulos.find(t => t.index === index);
    return tituloObj ? tituloObj.titulo : '';
  }

  trackByIndex(index: number): number {
    return index;
  }

  private chunkArray(array: string[], chunkSize: number): string[][] {
    const result: string[][] = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      result.push(array.slice(i, i + chunkSize));
    }
    return result;
  }
}
