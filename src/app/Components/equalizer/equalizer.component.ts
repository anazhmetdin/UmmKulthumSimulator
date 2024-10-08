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
  @Input() distance = 50;

  BACK_ABSORPTION = 0.4;
  INITIAL_GAIN = 1;
  @Input() MIN_GAIN = 0.10;
  @Input() MAX_GAIN = 0.74;

  audioContext!: AudioContext;
  panNode!: PannerNode;
  gainNode!: GainNode;

  getAudioConfig() {
    const RAD = this.angle * Math.PI / 180;
    const positionX = 2 * Math.sin(RAD) * this.distanceGain;
    const positionY = 0
    const positionZ = 2 * Math.cos(RAD) * this.distanceGain;
    let directionGain = this.INITIAL_GAIN;

    if (this.angle > 90 && this.angle < 270) {
      const COS = Math.abs(Math.cos(RAD));
      directionGain = 1 - this.BACK_ABSORPTION * COS;
    }

    return { positionX, positionY, positionZ, gain: directionGain * this.distanceGain };
  }

  get distanceGain() {
    const clampedDistance = Math.max(this.distance, 1);
    const gain = 1 / (1 + Math.pow(clampedDistance / 10, 2));
    const scaledGain = this.MIN_GAIN + (this.MAX_GAIN - this.MIN_GAIN) * gain;
    return scaledGain;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.ConfigureNodes();
  }

  private ConfigureNodes() {
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
    this.ConfigureNodes();
  }
}
