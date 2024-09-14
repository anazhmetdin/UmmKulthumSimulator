import { AfterViewInit, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-dj',
  standalone: true,
  imports: [],
  templateUrl: './dj.component.html',
  styleUrl: './dj.component.css'
})
export class DJComponent implements AfterViewInit, OnChanges {

  @Output() changeAngle: EventEmitter<number> = new EventEmitter;
  @Output() changeDistance: EventEmitter<number> = new EventEmitter;

  @Input() playing = true;
  @Input() active = true;
  heartbeatID: number | null = null

  @Input() angle = 0;
  angleStep = 0.5;
  destinationAngle = 0;
  isAngleChanging = true;

  @Input() distance = 75;
  distanceStep = 1;
  destinationDistance = 0;
  isDistanceChanging = false;

  heartbeatMelliSeconds = 13;

  probabilityChangeAngle = 0.9;

  get decideAngleChange() {
    return this.isAngleChanging && Math.random() > this.probabilityChangeAngle;
  }

  get destinationAngleReached() {
    return Math.abs(this.angle - this.destinationAngle) % 360 <= Math.abs(this.angleStep);
  }

  probabilityChangeDistance = 0.0;

  get decideDistanceChange() {
    return this.isDistanceChanging && Math.random() > this.probabilityChangeDistance;
  }

  private heartbeat(): number {
    return setInterval(() => {

      if (!this.playing || !this.active) {
        this.stopHeartbeat();
        return;
      }

      this.AngleChangeCycle();

      if (this.decideDistanceChange) {
        this.destinationDistance = (this.destinationDistance + this.distanceStep) % 200;
        this.distance = 100 - Math.abs(100 - this.destinationDistance);
        // this.destinationDistance = Math.random()*100;
        this.changeDistance.emit(this.distance);
      }
    }, this.heartbeatMelliSeconds);
  }

  private AngleChangeCycle() {
    if (this.destinationAngleReached) {
      const nextHeartBeat = (1500 + Math.random() * (3000 - 1500));
      if (this.decideAngleChange) {
        this.CalculateNextAngle(nextHeartBeat);
      }
      else if (this.isAngleChanging) {
        this.HaltAngleChange(nextHeartBeat);
      }
    }
    else {
      this.angle = (this.angle + this.angleStep) % 360;
      this.changeAngle.emit(this.angle);
    }
  }

  private HaltAngleChange(nextHeartBeat: number) {
    const currentIsAngleChanging = this.isAngleChanging;
    this.isAngleChanging = false;
    setTimeout(() => { this.isAngleChanging = currentIsAngleChanging; }, nextHeartBeat);
  }

  private CalculateNextAngle(nextHeartBeat: number) {
    this.destinationAngle = Math.random() * 360;
    const tempStep = (this.destinationAngle - this.angle) % 360;
    this.angleStep = this.randomSign * Math.max(tempStep, 360 - tempStep) / nextHeartBeat;
  }

  get randomSign() {
    return Math.random() < 0.5 ? 1 : -1;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.startHeartbeat();
  }

  ngAfterViewInit(): void {
    this.startHeartbeat();
  }

  private startHeartbeat() {
    if (!this.heartbeatID) {
      this.heartbeatID = this.heartbeat();
    }
  }

  private stopHeartbeat() {
    if (this.heartbeatID) {
      clearInterval(this.heartbeatID);
    }
  }
}
