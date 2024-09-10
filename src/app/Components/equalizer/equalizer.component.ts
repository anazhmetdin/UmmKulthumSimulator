import { AfterViewInit, Component, Input, input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-equalizer',
  standalone: true,
  imports: [],
  templateUrl: './equalizer.component.html',
  styleUrl: './equalizer.component.css'
})
export class EqualizerComponent implements OnChanges, AfterViewInit {

  @Input() audioElement!: HTMLAudioElement;
  @Input() angle: number = 0;
  @Input() distance = 0.5;

  BACK_ABSORPTION = 0.4;
  AMBIENT_RATIO = 0.9
  INITIAL_GAIN = 1;

  audioContext!: AudioContext;
  panNode!: PannerNode;
  gainNode!: GainNode;

  getAudioConfig() {
    const RAD = this.angle * Math.PI / 180;
    const positionX = Math.sin(RAD) * this.distance;
    const positionY = 0
    const positionZ = Math.cos(RAD) * this.distance;
    let directionGain = this.INITIAL_GAIN;

    if (this.angle > 90 && this.angle < 270) {
      const COS = Math.abs(Math.cos(RAD));
      directionGain = 1 - this.BACK_ABSORPTION * COS;
    }

    return { positionX, positionY, positionZ, gain: directionGain * this.distanceGain };
  }

  get distanceGain() {
    return (100 - this.distance) / 100 + (1 - this.AMBIENT_RATIO);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.audioContext) {
      const audioConfig = this.getAudioConfig();
      this.panNode.positionX.value = audioConfig.positionX;
      this.panNode.positionY.value = audioConfig.positionY;
      this.panNode.positionZ.value = audioConfig.positionZ;
      this.gainNode.gain.value = audioConfig.gain;
    }
  }

  ngAfterViewInit(): void {
    this.audioContext = new window.AudioContext();
    const AUDIO_SOURCE = this.audioContext.createMediaElementSource(this.audioElement);
    const audioConfig = this.getAudioConfig();
    this.panNode = new PannerNode(this.audioContext, { panningModel: 'HRTF' });
    this.gainNode = new GainNode(this.audioContext, { gain: audioConfig.gain });
    AUDIO_SOURCE.connect(this.panNode);
    this.panNode.connect(this.gainNode);
    this.gainNode.connect(this.audioContext.destination);
  }
}
