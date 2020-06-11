import 'reflect-metadata';
import 'core-js/es6/reflect';
import 'core-js/es7/reflect';
import 'zone.js';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { UpgradeModule } from '@angular/upgrade/static';
import app from './app-js';
import { HsMapServiceProvider, HsLayoutServiceProvider } from 'hslayers-ng/ajs-upgraded-providers';
import { HsConfigProvider } from 'hslayers-ng/ajs-upgraded-providers';
import { HsLayoutModule } from 'hslayers-ng/components/layout/layout.module';
@NgModule({
    imports: [
        BrowserModule,
        UpgradeModule,
        HsLayoutModule
    ],
    declarations: [
        
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