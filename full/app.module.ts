import 'reflect-metadata';
import 'core-js/es6/reflect';
import 'core-js/es7/reflect';
import 'zone.js';
import { NgModule, ComponentRef, ApplicationRef } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { UpgradeModule } from '@angular/upgrade/static';
import app from './app-js';
import { HsMapServiceProvider, HsLayoutServiceProvider, HsUtilsServiceProvider } from 'hslayers-ng/ajs-upgraded-providers';
import { HsConfigProvider } from 'hslayers-ng/ajs-upgraded-providers';
import { HsLayoutModule } from 'hslayers-ng/components/layout/layout.module';
import { HsLegendComponent } from 'hslayers-ng/components/legend/legend.component';
import { APP_BOOTSTRAP_LISTENER } from '@angular/core';
import { BootstrapComponent } from 'hslayers-ng/bootstrap.component';
import { HsCoreModule } from 'hslayers-ng/components/core/core.module';
@NgModule({
    imports: [
        BrowserModule,
        UpgradeModule,
        HsLayoutModule,
        HsCoreModule
    ],
    declarations: [

    ],
    entryComponents: [

    ],
    providers: [HsMapServiceProvider, HsConfigProvider, HsUtilsServiceProvider,
        {
            provide: APP_BOOTSTRAP_LISTENER, multi: true, useFactory: () => {
                return (component: ComponentRef<BootstrapComponent>) => {
                    component.instance.upgrade.bootstrap(document.documentElement, [app.name], { strictDi: true });
                }
            }
        }]
})
export class AppModule {
    constructor() { }
    ngDoBootstrap(appRef: ApplicationRef) {
        appRef.bootstrap(BootstrapComponent);
    }
}