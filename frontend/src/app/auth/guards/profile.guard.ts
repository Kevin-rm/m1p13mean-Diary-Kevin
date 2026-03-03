import { inject } from "@angular/core";
import { Router, type CanActivateFn } from "@angular/router";
import { AuthService } from "../auth.service";

export function profileGuard(...codes: string[]): CanActivateFn {
  return () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (!authService.isAuthenticated()) return router.createUrlTree(["/login"]);
    if (authService.hasProfile(...codes)) return true;
    return router.createUrlTree(["/"]);
  };
}
