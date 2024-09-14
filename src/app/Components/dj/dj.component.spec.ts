import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DJComponent } from './dj.component';

describe('DJComponent', () => {
  let component: DJComponent;
  let fixture: ComponentFixture<DJComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DJComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DJComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
