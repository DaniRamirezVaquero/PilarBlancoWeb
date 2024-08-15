import { Component, OnInit, OnDestroy } from '@angular/core';

interface Tape {
  tapeName: string;
  url: string;
}

@Component({
  selector: 'app-cassette',
  standalone: true,
  imports: [],
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

  audio: HTMLAudioElement;
  previousButton: HTMLElement | null;
  playButton: HTMLElement | null;
  pauseButton: HTMLElement | null;
  nextButton: HTMLElement | null;
  firstG: HTMLElement | null;
  secondG: HTMLElement | null;
  tape: string | null = this.tapes[0].tapeName;
  popUp: HTMLElement | null;
  currentTapeIndex: number = 0;

  spinning: boolean = false;
  progress: number = 0;
  intervalId: any;
  volumen: number = 0.4;
  wasPlaying: boolean = false;

  playTooltip: boolean = true;
  otherTooltip: boolean = false;

  constructor() {
    this.audio = new Audio(this.tapes[0].url);
    this.audio.volume = this.volumen;
    this.previousButton = document.querySelector('.previous');
    this.playButton = document.querySelector('.play');
    this.pauseButton = document.querySelector('.pause');
    this.nextButton = document.querySelector('.next');
    this.firstG = document.querySelector(".first-g");
    this.secondG = document.querySelector(".second-g");
    this.popUp = document.querySelector('.alert');
  }

  ngOnInit() {
    this.audio.addEventListener('timeupdate', this.updateProgress.bind(this));
  }

  ngOnDestroy() {
    this.audio.removeEventListener('timeupdate', this.updateProgress.bind(this));
    clearInterval(this.intervalId);
  }

  playTape(): void {
    this.audio.play();
    this.spin();
    this.audio.loop = true;
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
    this.audio.pause();
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
    this.wasPlaying = !this.audio.paused;
    if (newTapeIndex >= this.tapes.length) {
      newTapeIndex = 0; // Volver a la primera pista
    }
    if (this.tape) {
      this.tape = this.tapes[newTapeIndex].tapeName;
    }
    this.pauseBtn();
    this.audio = new Audio(this.tapes[newTapeIndex].url);
    this.audio.addEventListener('timeupdate', this.updateProgress.bind(this));
    this.audio.volume = this.volumen;

    if (this.wasPlaying) {
      this.playTape();
    }
    return this.currentTapeIndex = newTapeIndex;
  }

  previousTape(): number {
    let newTapeIndex = this.currentTapeIndex - 1;
    this.wasPlaying = !this.audio.paused;
    if (newTapeIndex < 0) {
      newTapeIndex = this.tapes.length - 1; // Volver a la última pista
    }
    if (this.tape) {
      this.tape = this.tapes[newTapeIndex].tapeName;
    }
    this.pauseBtn();
    this.audio = new Audio(this.tapes[newTapeIndex].url);
    this.audio.addEventListener('timeupdate', this.updateProgress.bind(this));
    this.audio.volume = this.volumen;

    if (this.wasPlaying) {
      this.playTape();
    }
    return this.currentTapeIndex = newTapeIndex;
  }

  updateProgress(): void {
    if (this.audio.duration) {
      this.progress = (this.audio.currentTime / this.audio.duration) * 100;
    }
  }

  onProgressChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const newTime = (input.valueAsNumber / 100) * this.audio.duration;
    this.audio.currentTime = newTime;
  }

  onVolumeChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.audio.volume = input.valueAsNumber;
    this.volumen = input.valueAsNumber;
  }
}
