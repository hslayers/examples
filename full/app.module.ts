import 'reflect-metadata';
import 'core-js/es6/reflect';
import 'core-js/es7/reflect';
import 'zone.js';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { UpgradeModule } from '@angular/upgrade/static';
import app from './app-js';
import { HsPrintModule } from 'hslayers-ng/components/print/print.module';
import { HsMapServiceProvider } from 'hslayers-ng/ajs-upgraded-providers';
import { HsConfigProvider } from 'hslayers-ng/ajs-upgraded-providers';
@NgModule({
    imports: [
        BrowserModule,
        UpgradeModule,
        HsPrintModule
    ],
    declarations: [
        // ... existing declarations       
    ],
    entryComponents: [
        
    ],
    providers: [HsMapServiceProvider, HsConfigProvider]
})
export class AppModule {
    constructor(private upgrade: UpgradeModule) { }
    ngDoBootstrap() {
        this.upgrade.bootstrap(document.documentElement, [app.name], { strictDi: true });
    }
}