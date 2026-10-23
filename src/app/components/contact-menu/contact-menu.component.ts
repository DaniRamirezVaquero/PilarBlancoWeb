import { Component, ElementRef, Input, OnDestroy, signal, viewChild } from '@angular/core';
import { IconComponent } from '../icon/icon.component';
import { CONTACT } from '../../data/portfolio.data';

/**
 * Botón «Contacto» con su ficha desplegable: dirección copiable, redactar en
 * Gmail o en el cliente de correo, e Instagram y Vimeo. No hay representación:
 * el contacto es directo con Pilar.
 */
@Component({
  selector: 'app-contact-menu',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './contact-menu.component.html',
  styleUrl: './contact-menu.component.css',
  host: {
    '(document:click)': 'onDocumentClick($event)',
    '(document:keydown.escape)': 'close()',
  },
})
export class ContactMenuComponent implements OnDestroy {
  /** «compact» muestra solo el icono (barra en móvil). */
  @Input() variant: 'full' | 'compact' = 'full';
  /** Hacia dónde se abre la ficha respecto al botón. */
  @Input() align: 'right' | 'left' = 'right';

  readonly email = CONTACT.email;
  readonly mailtoUrl = `mailto:${CONTACT.email}`;
  readonly gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(CONTACT.email)}`;
  readonly instagram = CONTACT.instagram;
  readonly vimeo = CONTACT.vimeo;

  readonly open = signal(false);
  readonly copied = signal(false);
  readonly copyFailed = signal(false);

  private readonly root = viewChild<ElementRef<HTMLElement>>('root');
  private copiedTimer: ReturnType<typeof setTimeout> | null = null;

  toggle(): void {
    this.open.update((value) => !value);
    if (!this.open()) {
      this.resetCopied();
    }
  }

  close(): void {
    if (!this.open()) {
      return;
    }
    this.open.set(false);
    this.resetCopied();
  }

  onDocumentClick(event: MouseEvent): void {
    const root = this.root()?.nativeElement;
    if (this.open() && root && !root.contains(event.target as Node)) {
      this.close();
    }
  }

  async copyEmail(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.email);
      this.copyFailed.set(false);
      this.copied.set(true);
      this.clearCopiedTimer();
      this.copiedTimer = setTimeout(() => this.copied.set(false), 2000);
    } catch {
      // Sin permiso de portapapeles: la dirección queda seleccionable a mano.
      this.copied.set(false);
      this.copyFailed.set(true);
    }
  }

  ngOnDestroy(): void {
    this.clearCopiedTimer();
  }

  private resetCopied(): void {
    this.copied.set(false);
    this.copyFailed.set(false);
    this.clearCopiedTimer();
  }

  private clearCopiedTimer(): void {
    if (this.copiedTimer !== null) {
      clearTimeout(this.copiedTimer);
      this.copiedTimer = null;
    }
  }
}
