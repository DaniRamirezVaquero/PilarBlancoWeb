import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';

import { routes } from './app.routes';
import { RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module } from 'ng-recaptcha';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withViewTransitions({ skipInitialTransition: true })),
    importProvidersFrom(RecaptchaV3Module),
    {provide: RECAPTCHA_V3_SITE_KEY, useValue: environment.recaptcha.siteKey},
  ],
};
