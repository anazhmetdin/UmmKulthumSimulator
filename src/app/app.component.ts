import { ChangeDetectorRef, Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor( private cdref: ChangeDetectorRef ) {}

  title = 'umm-kulthum-simulator';
  audioPath = "https://stream-161.zeno.fm/zsgrfxg71s8uv";

  radioControl: HTMLAudioElement | null = null;
  radioAngle = 0;
  radioDistance = 50;

  setRadioControl(audioControl: HTMLAudioElement) {
    this.radioControl = audioControl;
    this.cdref.detectChanges();
  }

  setRadioAngle(angle: number) {
    this.radioAngle = angle;
  }

  setRadioDistance(distance: number) {
    this.radioDistance = distance;
  }
}
