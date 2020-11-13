import {AppComponent} from './app.component';
import {BrowserModule} from '@angular/platform-browser';
import {HsAppModule} from 'hslayers-ng/app.module';
import {NgModule} from '@angular/core';

@NgModule({
  imports: [BrowserModule, HsAppModule],
  declarations: [AppComponent],
  exports: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
