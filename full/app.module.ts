import 'reflect-metadata';
import 'core-js/es6/reflect';
import 'core-js/es7/reflect';
import 'zone.js';
import { NgModule, ComponentRef, ApplicationRef } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { UpgradeModule } from '@angular/upgrade/static';
import app from './app-js';
import { APP_BOOTSTRAP_LISTENER } from '@angular/core';
import { BootstrapComponent } from 'hslayers-ng/bootstrap.component';
import { HsCoreModule } from 'hslayers-ng/components/core/core.module';
@NgModule({
    imports: [
        BrowserModule,
        UpgradeModule,
        HsCoreModule
    ],
    declarations: [],
    entryComponents: [],
    providers: [
        {
            provide: APP_BOOTSTRAP_LISTENER, multi: true, useFactory: () => {
                return (component: ComponentRef<BootstrapComponent>) => {
                    //When ng9 part is bootstrapped continue with AngularJs modules
                    component.instance.upgrade.bootstrap(document.documentElement, [app.name], { strictDi: true });
                }
            }
        }]
})
export class AppModule {
    constructor() { }
    ngDoBootstrap(appRef: ApplicationRef) {
        //First bootstrap Angular 9 app part on hs element
        appRef.bootstrap(BootstrapComponent);
    }
}