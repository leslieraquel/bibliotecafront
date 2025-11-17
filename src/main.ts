  import { bootstrapApplication } from '@angular/platform-browser';
  import { appConfig } from './app/app.config';
  import { AppComponent } from './app/app.component';
  import { LoginComponent } from  './app/components/login/login.component';
  import { importProvidersFrom } from '@angular/core';
  import { HttpClientModule } from '@angular/common/http';
  import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
  import { provideToastr } from 'ngx-toastr';
  import { provideAnimations } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';


bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [provideToastr(),provideAnimations(), 
    ...(appConfig.providers || []),
    importProvidersFrom(
      HttpClientModule,
      BrowserAnimationsModule
       
    ), provideAnimationsAsync()
  ]
}).catch((err) => console.error(err));