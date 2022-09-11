import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BowlingScoreModule } from './bowling-score/bowling-score.module';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule, BowlingScoreModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
