import {
  Component, ElementRef, Input, NgZone, OnChanges, OnDestroy, PLATFORM_ID, inject, signal, viewChild,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Frame } from '../../data/portfolio.data';
import { IconComponent } from '../icon/icon.component';
import { PencilRingComponent } from '../pencil-ring/pencil-ring.component';

/** Aumento de la lupa respecto a la miniatura. */
const LOUPE_ZOOM = 2.6;

interface Box {
  left: number;
  top: number;
  width: number;
  height: number;
}

/**
 * Caja que ocupa una imagen con object-fit: cover dentro de un marco, según su
 * object-position (en %, que es lo que usa la web).
 */
function coverBox(frameW: number, frameH: number, imgW: number, imgH: number, position: string): Box {
  const scale = Math.max(frameW / imgW, frameH / imgH);
  const width = imgW * scale;
  const height = imgH * scale;
  const [px, py] = position.split(' ').map((value) => (value.endsWith('%') ? parseFloat(value) / 100 : 0.5));
  return {
    left: (frameW - width) * (px ?? 0.5),
    top: (frameH - height) * (py ?? 0.5),
    width,
    height,
  };
}

/**
 * Hoja de contactos: tiras de negativo con fotogramas. Al pasar el ratón, una lupa
 * amplía el fotograma; al pulsarlo, se rodea en rojo y se abre en grande.
 * En pantallas táctiles cada tira se desliza en horizontal y un toque amplía.
 */
@Component({
  selector: 'app-contact-sheet',
  standalone: true,
  imports: [IconComponent, PencilRingComponent],
  templateUrl: './contact-sheet.component.html',
  styleUrl: './contact-sheet.component.css',
})
export class ContactSheetComponent implements OnChanges, OnDestroy {
  @Input({ required: true }) frames: Frame[] = [];
  /** Fotogramas por tira en escritorio. */
  @Input() perStrip = 4;
  /** Proporción de cada fotograma (CSS aspect-ratio). */
  @Input() aspect = '4 / 5';
  /** Atributo sizes de las miniaturas. */
  @Input() sizes = '(min-width: 1024px) 22vw, 62vw';
  /** Rótulo del código de borde cuando el fotograma no trae título. */
  @Input() edgeLabel = 'Pilar Blanco';
  /** «sheet»: tiras horizontales; «vertical»: una sola tira de pie (portada del inicio). */
  @Input() layout: 'sheet' | 'vertical' = 'sheet';
  /** Fotograma elegido de partida (índice), o null. */
  @Input() chosen: number | null = null;
  /** Retraso del trazo del círculo inicial, en ms. */
  @Input() ringDelay = 0;
  /** Prioridad de carga de las miniaturas (true en el primer pantallazo). */
  @Input() eager = false;

  strips: { frame: Frame; index: number }[][] = [];
  readonly current = signal(0);

  private readonly dialog = viewChild<ElementRef<HTMLDialogElement>>('dialog');
  private readonly loupe = viewChild<ElementRef<HTMLElement>>('loupe');
  private readonly zone = inject(NgZone);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private returnFocus: HTMLElement | null = null;

  ngOnChanges(): void {
    const indexed = this.frames.map((frame, index) => ({ frame, index }));
    const size = this.layout === 'vertical' ? indexed.length : this.perStrip;
    this.strips = [];
    for (let i = 0; i < indexed.length; i += size) {
      this.strips.push(indexed.slice(i, i + size));
    }
  }

  open(index: number, trigger: EventTarget | null): void {
    this.chosen = index;
    this.current.set(index);
    this.hideLoupe();
    this.returnFocus = trigger instanceof HTMLElement ? trigger : null;
    this.dialog()?.nativeElement.showModal();
  }

  close(): void {
    this.dialog()?.nativeElement.close();
  }

  onDialogClose(): void {
    this.chosen = this.current();
    this.returnFocus?.focus();
  }

  /** Un clic en el fondo (fuera de la copia) cierra la ampliación. */
  onDialogClick(event: MouseEvent): void {
    if (event.target === this.dialog()?.nativeElement) {
      this.close();
    }
  }

  step(delta: number): void {
    const total = this.frames.length;
    this.current.set((this.current() + delta + total) % total);
  }

  onDialogKey(event: KeyboardEvent): void {
    if (event.key === 'ArrowRight') {
      this.step(1);
    } else if (event.key === 'ArrowLeft') {
      this.step(-1);
    }
  }

  // ——— Lupa ———

  onPointerMove(event: PointerEvent, frame: Frame): void {
    if (!this.isBrowser || event.pointerType !== 'mouse') {
      return;
    }
    const loupe = this.loupe()?.nativeElement;
    const target = event.currentTarget as HTMLElement | null;
    if (!loupe || !target) {
      return;
    }
    const img = target.querySelector('img');
    if (!img || !img.naturalWidth) {
      return;
    }
    this.zone.runOutsideAngular(() => {
      const rect = target.getBoundingClientRect();
      // La miniatura usa object-fit: cover; la lupa reproduce ese mismo recorte
      // para ampliar la foto con su proporción real, sin estirarla al fotograma.
      const cover = coverBox(rect.width, rect.height, img.naturalWidth, img.naturalHeight,
        getComputedStyle(img).objectPosition);
      const x = event.clientX - rect.left - cover.left;
      const y = event.clientY - rect.top - cover.top;
      if (loupe.dataset['src'] !== frame.full) {
        loupe.style.backgroundImage = `url("${encodeURI(frame.full)}")`;
        loupe.dataset['src'] = frame.full;
      }
      const half = loupe.offsetWidth / 2;
      loupe.style.backgroundSize = `${cover.width * LOUPE_ZOOM}px ${cover.height * LOUPE_ZOOM}px`;
      loupe.style.backgroundPosition = `${half - x * LOUPE_ZOOM}px ${half - y * LOUPE_ZOOM}px`;
      loupe.style.transform = `translate3d(${event.clientX - half}px, ${event.clientY - half}px, 0)`;
      loupe.classList.add('is-on');
    });
  }

  hideLoupe(): void {
    this.loupe()?.nativeElement.classList.remove('is-on');
  }

  ngOnDestroy(): void {
    this.hideLoupe();
  }
}
