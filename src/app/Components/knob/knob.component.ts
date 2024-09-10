import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, input, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';

@Component({
  selector: 'app-knob',
  templateUrl: './knob.component.html',
  styleUrls: ['./knob.component.css']
})
export class KnobComponent implements AfterViewInit, OnChanges {

  @Input()  knobColor = 'var(--light)';
  @Input()  pointerColor = 'var(--dark)';
  @Input()  strokeColor = 'var(--accent)';

  active = false;
  @Input() angle = 0;
  @Output() angleChanged: EventEmitter<number> = new EventEmitter();

  @ViewChild('knob') knobElement!: ElementRef;
  centerX!: number;
  centerY!: number;

  ngAfterViewInit(): void {
    this.getKnopCenter();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.angleChanged.emit(this.angle);
  }

  @HostListener('window:resize')
  private getKnopCenter() {
    const rect = this.knobElement.nativeElement.getBoundingClientRect();
    this.centerX = rect.x + rect.width / 2;
    this.centerY = rect.y + rect.height / 2;
  }

  activate(moueEvent: MouseEvent) {
    this.active = true;
    this.AdjustAngle(moueEvent);
  }

  @HostListener('document:mousemove', ['$event'])
  turn(moueEvent: MouseEvent) {
    if (!this.active) return;
    this.AdjustAngle(moueEvent);
  }

  private AdjustAngle(moueEvent: MouseEvent) {
    this.angle = 90 + Math.atan2(moueEvent.clientY - this.centerY, moueEvent.clientX - this.centerX) * (180 / Math.PI);;
    this.angleChanged.emit(this.angle);
  }

  @HostListener('document:mouseup', ['$event'])
  release(moueEvent: MouseEvent) {
    this.active = false;
  }
}
