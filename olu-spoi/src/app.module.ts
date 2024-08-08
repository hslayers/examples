import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {HslayersModule} from 'hslayers-ng';

import {AppComponent} from './app.component';
import {InfoWidgetComponent} from './info.component';

@NgModule({
  imports: [BrowserModule, HslayersModule, InfoWidgetComponent],
  declarations: [AppComponent],
  exports: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
