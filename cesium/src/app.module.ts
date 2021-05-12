import {AppComponent} from './app.component';
import {BrowserModule} from '@angular/platform-browser';
import {HslayersModule} from 'hslayers-ng';
import {HsCesiumModule} from 'hslayers-cesium';
import {NgModule} from '@angular/core';

@NgModule({
  imports: [BrowserModule, HslayersModule, HsCesiumModule],
  declarations: [AppComponent],
  exports: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
