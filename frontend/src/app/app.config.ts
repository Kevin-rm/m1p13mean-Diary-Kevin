import {
  APP_INITIALIZER,
  ApplicationConfig,
  inject,
  provideBrowserGlobalErrorListeners,
} from "@angular/core";
import { provideRouter } from "@angular/router";
import { provideHttpClient, withInterceptors } from "@angular/common/http";
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";
import { firstValueFrom } from "rxjs";

import { routes } from "./app.routes";
import { credentialsInterceptor } from "./core/interceptors/credentials.interceptor";
import { AuthService } from "./auth/auth.service";

function initializeAuth(): () => Promise<boolean> {
  const authService = inject(AuthService);
  return () => firstValueFrom(authService.checkAuthState());
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([credentialsInterceptor])),
    provideAnimationsAsync(),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeAuth,
      multi: true,
    },
  ],
};
