

import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  PLATFORM_ID,
  ViewChild
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * Floating background-music toggle.
 * Music starts automatically when the site loads. Browsers that block
 * autoplay-with-sound will have playback kick in on the visitor's first
 * interaction with the page instead, and the button lets them toggle it
 * on/off at any time.
 */
@Component({
  selector: 'app-music-player',
  standalone: true,
  templateUrl: './music-player.component.html',
  styleUrls: ['./music-player.component.css']
})
export class MusicPlayerComponent implements AfterViewInit {
  @ViewChild('audioEl') audioEl!: ElementRef<HTMLAudioElement>;
  isPlaying = false;
  isMuted = true;

  private readonly isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser) {
      return;
    }
    const audio = this.audioEl.nativeElement;
    audio.addEventListener('play', () => (this.isPlaying = true));
    audio.addEventListener('pause', () => (this.isPlaying = false));
    audio.addEventListener('volumechange', () => (this.isMuted = audio.muted));
    this.isMuted = true;
    audio.muted = true;
  }

  get musicLabel(): string {
    if (this.isPlaying && !this.isMuted) {
      return 'Tap to mute sound';
    }
    return 'Tap to play sound';
  }

  toggle(): void {
    const audio = this.audioEl.nativeElement;
    if (audio.paused) {
      this.isMuted = false;
      audio.muted = false;
      audio
        .play()
        .catch(() => {
          this.isMuted = true;
          audio.muted = true;
        });
      return;
    }

    if (this.isMuted) {
      this.isMuted = false;
      audio.muted = false;
      return;
    }

    this.isMuted = true;
    audio.muted = true;
  }
}


