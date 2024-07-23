import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration, provideProtractorTestingSupport } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { AuthService } from './auth.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { tokenInterceptor } from './token.interceptor';
import { provideHttpClient, withFetch } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }),
  provideRouter(routes), provideClientHydration(),
  provideAnimationsAsync(), provideProtractorTestingSupport(), provideHttpClient(withFetch()),
    AuthService, { provide: HTTP_INTERCEPTORS, useValue: tokenInterceptor, multi: true }, provideAnimationsAsync()],
};
