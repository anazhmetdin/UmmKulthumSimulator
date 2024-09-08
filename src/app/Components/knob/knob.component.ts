import { AfterViewInit, Component, ElementRef, HostListener, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'app-knob',
  templateUrl: './knob.component.html',
  styleUrls: ['./knob.component.css']
})
export class KnobComponent implements AfterViewInit {

  @Input()  knobColor = 'var(--light)';
  @Input()  pointerColor = 'var(--dark)';
  @Input()  strokeColor = 'var(--accent)';

  active = false;
  angle = 0;

  @ViewChild('knob') knobElement!: ElementRef;
  centerX!: number;
  centerY!: number;

  ngAfterViewInit(): void {
    this.GetKnopCenter();   // Y coordinate
  }

  private GetKnopCenter() {
    const rect = this.knobElement.nativeElement.getBoundingClientRect();
    this.centerX = rect.x + rect.width / 2;
    this.centerY = rect.y + rect.height / 2;
  }

  activate(moueEvent: MouseEvent) {
    this.active = true;
    this.GetKnopCenter();
    this.AdjustAngle(moueEvent);
  }

  @HostListener('document:mousemove', ['$event'])
  turn(moueEvent: MouseEvent) {
    if (!this.active) return;
    this.AdjustAngle(moueEvent);
  }

  private AdjustAngle(moueEvent: MouseEvent) {
    this.angle = 90 + Math.atan2(moueEvent.clientY - this.centerY, moueEvent.clientX - this.centerX) * (180 / Math.PI);;
  }

  @HostListener('document:mouseup', ['$event'])
  release(moueEvent: MouseEvent) {
    this.active = false;
  }
}
