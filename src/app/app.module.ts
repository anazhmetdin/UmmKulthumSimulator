import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { KnobComponent } from './Components/knob/knob.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AudioPlayerComponent } from './Components/audio-player/audio-player.component';
import { EqualizerComponent } from "./Components/equalizer/equalizer.component";

@NgModule({
  declarations: [
    AppComponent,
    KnobComponent,
    AudioPlayerComponent
  ],
  imports: [
    BrowserModule,
    NgbModule,
    EqualizerComponent
],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
