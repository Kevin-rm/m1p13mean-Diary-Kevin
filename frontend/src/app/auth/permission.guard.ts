import { inject } from "@angular/core";
import { Router, type CanActivateFn } from "@angular/router";
import { AuthService } from "./auth.service";

export function permissionGuard(...permissions: string[]): CanActivateFn {
  return () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (!authService.isAuthenticated()) return router.createUrlTree(["/login"]);
    if (authService.hasPermission(...permissions)) return true;
    return router.createUrlTree(["/"]);
  };
}
