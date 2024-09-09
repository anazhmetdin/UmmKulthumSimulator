import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-audio-player',
  templateUrl: './audio-player.component.html',
  styleUrls: ['./audio-player.component.css']
})
export class AudioPlayerComponent {
  @Input() audioPath = "";
  @Input() groovesCount = 7;
  @Input() skipping = 7;
  @Input() displayProgress = false;
  duration = 0;
  currentTime = 0;
  playing = false;

  playAudio(audioControl: HTMLAudioElement): void {
    audioControl.play();
    this.playing = true;
  }

  playPauseAudio(audioControl: HTMLAudioElement): void {
    if (this.playing) {
      this.pauseAduio(audioControl);
    }
    else {
      this.playAudio(audioControl);
    }
  }

  private pauseAduio(audioControl: HTMLAudioElement) {
    audioControl.pause();
    this.playing = false;
  }

  seekAudio(audioControl: HTMLAudioElement, n: number): void {
    audioControl.currentTime = n;
  }

  skipAudio(audioControl: HTMLAudioElement, n: number): void {

    const newTime = audioControl.currentTime + n * this.skipping;

    if (n < 0) {
      audioControl.currentTime = Math.max(0, newTime);
    }
    else {
      audioControl.currentTime = Math.min(this.getPlayableDuration(audioControl), newTime);
    }
  }

  getPlayableDuration(audioControl: HTMLAudioElement) {
    return audioControl.duration-2;
  }

  updateProgress(audioControl: HTMLAudioElement) {
    this.currentTime = audioControl.currentTime;
    this.setDuration(audioControl);
  }

  setDuration(audioControl: HTMLAudioElement) {
    this.duration = this.getPlayableDuration(audioControl);
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  }

  eventSeekAudio(audioControl: HTMLAudioElement, bar: HTMLInputElement) {
    this.seekAudio(audioControl, Number.parseFloat(bar.value));
  }
}
