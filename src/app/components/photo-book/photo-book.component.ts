import { Component, ElementRef, Input, signal, viewChild } from '@angular/core';
import { Frame } from '../../data/portfolio.data';
import { IconComponent } from '../icon/icon.component';

/**
 * Book de la sesión de estudio.
 * «session»: una copia grande a la luz y su hilera de copias en sombra; elegir una
 * la trae a la luz. «wall»: copias colgadas en columnas, con su pie de foto.
 * Pulsar la copia grande (o una del muro) la abre a pantalla completa.
 */
@Component({
  selector: 'app-photo-book',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './photo-book.component.html',
  styleUrl: './photo-book.component.css',
})
export class PhotoBookComponent {
  @Input({ required: true }) frames: Frame[] = [];
  @Input() layout: 'session' | 'wall' = 'session';
  /** Atributo sizes de las copias pequeñas (hilera o muro). */
  @Input() sizes = '(min-width: 1024px) 9vw, 6rem';
  /** Pie de las copias que no traen título. */
  @Input() caption = 'Pilar Blanco';

  /** Copia a la luz en la sesión. */
  readonly selected = signal(0);
  /** Copia abierta en la ampliación. */
  readonly current = signal(0);

  private readonly dialog = viewChild<ElementRef<HTMLDialogElement>>('dialog');
  private returnFocus: HTMLElement | null = null;

  select(index: number): void {
    this.selected.set(index);
  }

  open(index: number, trigger: EventTarget | null): void {
    this.current.set(index);
    this.returnFocus = trigger instanceof HTMLElement ? trigger : null;
    this.dialog()?.nativeElement.showModal();
  }

  close(): void {
    this.dialog()?.nativeElement.close();
  }

  /** Al cerrar, la sesión se queda en la copia que se estaba mirando. */
  onDialogClose(): void {
    if (this.layout === 'session') {
      this.selected.set(this.current());
    }
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
}
