import {
  ChangeDetectionStrategy, Component, DestroyRef, ElementRef, NgZone, afterNextRender, inject, input, signal,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { IconComponent } from '../icon/icon.component';
import { Credit } from '../../data/portfolio.data';
import { SECTION_IDS } from '../../data/sections.data';
import { RevealWindow, revealOnce } from '../../utils/reveal-once';

/**
 * Créditos destacados como títulos de crédito: el título de la obra, grande en Playfair, y debajo quién y el
 * formato en Lato pequeña. Mayúscula y minúscula, sin años. Entran fila a fila una sola vez, con una cortinilla.
 */
@Component({
  selector: 'app-credits-roll',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './credits-roll.component.html',
  styleUrl: './credits-roll.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class.is-armed]': 'armed()', '[class.is-shown]': 'shown()' },
})
export class CreditsRollComponent {
  readonly credits = input.required<readonly Credit[]>();
  /** Estado previo a la entrada: solo lo pone el JS en el navegador (el prerender pinta el estado final). */
  readonly armed = signal(false);
  /** Se queda en true tras la primera entrada. */
  readonly shown = signal(false);

  constructor() {
    const host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const zone = inject(NgZone);
    const win = inject(DOCUMENT).defaultView as RevealWindow | null;
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      const handle = revealOnce(host, win, () => zone.run(() => this.shown.set(true)), { deepLinkIds: SECTION_IDS });
      this.armed.set(handle.armed);
      destroyRef.onDestroy(() => handle.destroy());
    });
  }

  /** Título sin su última palabra: la última va unida al icono de enlace para que nunca quede sola. */
  titleHead(title: string): string {
    const cut = title.lastIndexOf(' ');
    return cut < 0 ? '' : title.slice(0, cut + 1);
  }

  titleTail(title: string): string {
    return title.slice(title.lastIndexOf(' ') + 1);
  }
}
