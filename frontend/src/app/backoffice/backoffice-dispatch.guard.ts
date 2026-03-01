import { inject } from "@angular/core";
import { Router, type CanActivateFn } from "@angular/router";
import { AuthService } from "@auth/auth.service";

export const backofficeDispatchGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const profileCode = authService.context()?.profile?.code;

  switch (profileCode) {
    case "admin":
      return router.createUrlTree(["/backoffice/admin"]);
    case "shop":
      return router.createUrlTree(["/backoffice/shop"]);
    default:
      return router.createUrlTree(["/"]);
  }
};
