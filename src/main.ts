import 'hammerjs';
import { enableProdMode,ApplicationRef  } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import {  enableDebugTools  } from '@angular/platform-browser';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
// https://indepth.dev/everything-you-need-to-know-about-debugging-angular-applications/
.then((module) => {
  if (!environment.production) {
    let applicationRef = module.injector.get(ApplicationRef);
    let appComponent = applicationRef.components[0];
    enableDebugTools(appComponent);
  } 
})
  .catch(err => console.error(err));
