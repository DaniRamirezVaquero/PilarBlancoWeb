import { Component, ElementRef, OnDestroy, signal, viewChild } from '@angular/core';
import { IconComponent } from '../icon/icon.component';

@Component({
    selector: 'app-socials',
    imports: [IconComponent],
    templateUrl: './socials.component.html',
    styleUrl: './socials.component.css',
    host: {
        '(document:click)': 'onDocumentClick($event)',
        '(document:keydown.escape)': 'closeEmailMenu()',
    },
})
export class SocialsComponent implements OnDestroy {
  readonly email = 'pilarblanco.actriz@gmail.com';
  readonly mailtoUrl = `mailto:${this.email}`;
  readonly gmailComposeUrl =
    `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(this.email)}`;

  readonly emailOpen = signal(false);
  readonly copied = signal(false);

  private readonly emailMenu = viewChild<ElementRef<HTMLElement>>('emailMenu');
  private copiedTimer: ReturnType<typeof setTimeout> | null = null;

  toggleEmailMenu(): void {
    this.emailOpen.update((open) => !open);
    if (!this.emailOpen()) {
      this.resetCopied();
    }
  }

  closeEmailMenu(): void {
    if (!this.emailOpen()) {
      return;
    }
    this.emailOpen.set(false);
    this.resetCopied();
  }

  onDocumentClick(event: MouseEvent): void {
    const root = this.emailMenu()?.nativeElement;
    if (!this.emailOpen() || !root) {
      return;
    }
    if (!root.contains(event.target as Node)) {
      this.closeEmailMenu();
    }
  }

  async copyEmail(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.email);
      this.copied.set(true);
      this.clearCopiedTimer();
      this.copiedTimer = setTimeout(() => this.copied.set(false), 2000);
    } catch {
      this.copied.set(false);
    }
  }

  ngOnDestroy(): void {
    this.clearCopiedTimer();
  }

  private resetCopied(): void {
    this.copied.set(false);
    this.clearCopiedTimer();
  }

  private clearCopiedTimer(): void {
    if (this.copiedTimer !== null) {
      clearTimeout(this.copiedTimer);
      this.copiedTimer = null;
    }
  }
}
