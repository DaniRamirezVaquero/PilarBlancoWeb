import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { DecimalPipe, isPlatformBrowser } from '@angular/common';

interface Tape {
  tapeName: string;
  url: string;
}

@Component({
    selector: 'app-cassette',
    imports: [DecimalPipe],
    templateUrl: './cassette.component.html',
    styleUrls: ['./cassette.component.css']
})
export class CassetteComponent implements OnInit, OnDestroy {

  tapes: Tape[] = [
    {
      tapeName: 'Demo Publicidad',
      url: "assets/tapes/Demo2.mp3"
    },
    {
      tapeName: "Demo 1",
      url: "assets/tapes/Demo1.mp3"
    },
    {
      tapeName: "Demo 3",
      url: "assets/tapes/Demo3.mp3"
    },
    {
      tapeName: "Demo 4",
      url: "assets/tapes/Demo4.mp3"
    }
  ];

  /**
   * El audio no se instancia hasta que el usuario pulsa "play" (ver playTape()):
   * crearlo en el constructor hacía que el navegador empezara a descargar el
   * MP3 (~450 KB) solo por entrar en /voice, aunque nunca se reprodujera.
   */
  audio: HTMLAudioElement | null = null;
  tape: string | null = this.tapes[0].tapeName;
  currentTapeIndex: number = 0;

  spinning: boolean = false;
  progress: number = 0;
  intervalId: any;
  volumen: number = 0.4;
  wasPlaying: boolean = false;
  isPlaying: boolean = false;

  playTooltip: boolean = true;
  otherTooltip: boolean = false;

  constructor(@Inject(PLATFORM_ID) private platformId: object) { }

  ngOnInit() { }

  /** Crea (si falta) el elemento Audio de la pista actual y lo cablea. */
  private ensureAudio(): HTMLAudioElement | null {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }
    if (!this.audio) {
      this.audio = new Audio();
      this.audio.preload = 'none';
      this.audio.addEventListener('timeupdate', this.updateProgress.bind(this));
    }
    this.audio.volume = this.volumen;
    return this.audio;
  }

  ngOnDestroy() {
    this.audio?.removeEventListener('timeupdate', this.updateProgress.bind(this));
    clearInterval(this.intervalId);
  }

  playTape(): void {
    const audio = this.ensureAudio();
    if (!audio) {
      return;
    }
    if (!audio.src) {
      audio.src = this.tapes[this.currentTapeIndex].url;
    }
    audio.loop = true;
    audio.play();
    this.isPlaying = true;
    this.spin();
    this.intervalId = setInterval(() => this.updateProgress(), 1000);
  }


  hiddePlayTooltip(): void {
    this.playTooltip = false;

    setTimeout(() => {
      this.showOtherTooltip();
    },3000)
  }

  showOtherTooltip(): void {
    this.otherTooltip = true;
  }

  hiddeOtherTooltip(): void {
    this.otherTooltip = false;
  }

  pauseBtn(): void {
    this.audio?.pause();
    this.isPlaying = false;
    this.stopSpin();
    clearInterval(this.intervalId);
  }

  nextBtn(): void {
    this.nextTape();
    this.resetProgress();
  }

  previousBtn(): void {
    this.previousTape();
    this.resetProgress();
  }

  resetProgress(): void {
    this.progress = 0;
  }

  spin(): void {
    this.spinning = true;
  }

  stopSpin(): void {
    this.spinning = false;
  }

  currentTape(index?: number): Tape {
    if (index === undefined) {
      return this.tapes[this.currentTapeIndex];
    } else if (index < this.tapes.length) {
      if (this.tape) {
        this.tape = this.tapes[index].tapeName;
      }
      return this.tapes[index];
    }
    return this.tapes[this.currentTapeIndex];
  }

  nextTape(): number {
    let newTapeIndex = this.currentTapeIndex + 1;
    if (newTapeIndex >= this.tapes.length) {
      newTapeIndex = 0; // Volver a la primera pista
    }
    this.switchTape(newTapeIndex);
    return this.currentTapeIndex;
  }

  previousTape(): number {
    let newTapeIndex = this.currentTapeIndex - 1;
    if (newTapeIndex < 0) {
      newTapeIndex = this.tapes.length - 1; // Volver a la última pista
    }
    this.switchTape(newTapeIndex);
    return this.currentTapeIndex;
  }

  /** Cambia de pista sin descargar audio si el usuario nunca ha pulsado play. */
  private switchTape(newTapeIndex: number): void {
    this.wasPlaying = this.isPlaying;
    if (this.tape) {
      this.tape = this.tapes[newTapeIndex].tapeName;
    }
    this.pauseBtn();
    this.currentTapeIndex = newTapeIndex;
    if (this.audio) {
      // Ya existía el elemento Audio (se había reproducido algo): reutilizarlo.
      this.audio.src = this.tapes[newTapeIndex].url;
    }

    if (this.wasPlaying) {
      this.playTape();
    }
  }

  updateProgress(): void {
    if (this.audio?.duration) {
      this.progress = (this.audio.currentTime / this.audio.duration) * 100;
    }
  }

  onProgressChange(event: Event): void {
    if (!this.audio) {
      return;
    }
    const input = event.target as HTMLInputElement;
    const newTime = (input.valueAsNumber / 100) * this.audio.duration;
    this.audio.currentTime = newTime;
  }

  onVolumeChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (this.audio) {
      this.audio.volume = input.valueAsNumber;
    }
    this.volumen = input.valueAsNumber;
  }
}
