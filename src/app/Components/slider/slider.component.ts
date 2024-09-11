import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-slider',
  standalone: true,
  imports: [],
  templateUrl: './slider.component.html',
  styleUrl: './slider.component.css'
})
export class SliderComponent {
  @Input() value = 50;
  @Output() valueChanged: EventEmitter<number> = new EventEmitter();
  emitValue(event: Event) {
    if (event.target instanceof HTMLInputElement) {
      this.valueChanged.emit(+event.target.value);
    }
  }
}
