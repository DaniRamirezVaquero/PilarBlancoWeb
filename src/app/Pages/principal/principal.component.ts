import { Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ContactSheetComponent } from '../../components/contact-sheet/contact-sheet.component';
import { VoiceStripComponent } from '../../components/voice-strip/voice-strip.component';
import { VimeoFacadeComponent } from '../../components/vimeo-facade/vimeo-facade.component';
import { IconComponent } from '../../components/icon/icon.component';
import {
  BOOK, CONTACT, HERO_STRIP, HIGHLIGHT_CREDITS, REEL, SCENES, VOICE,
} from '../../data/portfolio.data';

/**
 * Inicio-dosier: en un solo recorrido, la ampliación de la portada con su tira de
 * contactos, el reel, el book, la voz, la trayectoria y el contacto. Cada bloque
 * enlaza a su página propia con el material completo.
 */
@Component({
  selector: 'app-principal',
  imports: [RouterLink, ContactSheetComponent, VoiceStripComponent, VimeoFacadeComponent, IconComponent],
  templateUrl: './principal.component.html',
  styleUrl: './principal.component.css',
})
export class PrincipalComponent {
  readonly heroStrip = HERO_STRIP;
  readonly book = BOOK;
  readonly voice = VOICE;
  readonly credits = HIGHLIGHT_CREDITS;
  readonly reel = REEL;
  readonly scenes = SCENES;

  readonly email = CONTACT.email;
  /** Usuario y dominio por separado: en móvil la dirección parte justo antes de la arroba. */
  readonly emailUser = CONTACT.email.slice(0, CONTACT.email.indexOf('@'));
  readonly emailDomain = CONTACT.email.slice(CONTACT.email.indexOf('@'));
  readonly mailtoUrl = `mailto:${CONTACT.email}`;
  readonly gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(CONTACT.email)}`;
  readonly instagram = CONTACT.instagram;
  readonly vimeo = CONTACT.vimeo;
  readonly cvUrl = CONTACT.cv;
  readonly photosZip = CONTACT.photosZip;

  readonly reelOpen = signal(false);
  readonly reelUrl: SafeResourceUrl = inject(DomSanitizer).bypassSecurityTrustResourceUrl(
    `https://player.vimeo.com/video/${REEL.videoId}?h=${REEL.hash}&autoplay=1`,
  );

  private readonly reelDialog = viewChild<ElementRef<HTMLDialogElement>>('reelDialog');

  /** Título sin su última palabra: la última va unida al icono de enlace para que nunca quede sola. */
  titleHead(title: string): string {
    const cut = title.lastIndexOf(' ');
    return cut < 0 ? '' : title.slice(0, cut + 1);
  }

  titleTail(title: string): string {
    return title.slice(title.lastIndexOf(' ') + 1);
  }

  openReel(): void {
    this.reelOpen.set(true);
    this.reelDialog()?.nativeElement.showModal();
  }

  closeReel(): void {
    this.reelDialog()?.nativeElement.close();
  }

  /** Al cerrar se retira el iframe para que el vídeo deje de sonar. */
  onReelClose(): void {
    this.reelOpen.set(false);
  }

  onReelBackdrop(event: MouseEvent): void {
    if (event.target === this.reelDialog()?.nativeElement) {
      this.closeReel();
    }
  }
}
