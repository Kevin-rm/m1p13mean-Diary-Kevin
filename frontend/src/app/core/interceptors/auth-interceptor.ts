import { inject } from "@angular/core";
import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpErrorResponse,
} from "@angular/common/http";
import { Router } from "@angular/router";
import { BehaviorSubject, throwError, filter, switchMap, take, catchError } from "rxjs";
import { environment } from "@env/environment";
import { AuthService } from "@auth/auth.service";

let isRefreshing = false;
const refreshSubject$ = new BehaviorSubject<boolean>(false);

const SKIP_URLS = ["/auth/refresh", "/auth/login"];

function shouldSkip(url: string): boolean {
  return SKIP_URLS.some(path => url.startsWith(`${environment.apiUrl}${path}`));
}

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
) => {
  if (!req.url.startsWith(environment.apiUrl) || shouldSkip(req.url)) {
    return next(req);
  }

  const authService = inject(AuthService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status !== 401) return throwError(() => error);

      if (isRefreshing) {
        return refreshSubject$.pipe(
          filter(ready => ready),
          take(1),
          switchMap(() => next(req)),
        );
      }

      isRefreshing = true;
      refreshSubject$.next(false);

      return authService.refreshToken().pipe(
        switchMap(() => {
          isRefreshing = false;
          refreshSubject$.next(true);
          return next(req);
        }),
        catchError(refreshError => {
          isRefreshing = false;
          refreshSubject$.next(false);
          authService.clearState();
          router.navigate(["/login"]);
          return throwError(() => refreshError);
        }),
      );
    }),
  );
};
