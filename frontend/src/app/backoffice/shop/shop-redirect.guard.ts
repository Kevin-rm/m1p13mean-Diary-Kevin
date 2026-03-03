import { inject } from "@angular/core";
import { Router, type CanActivateFn } from "@angular/router";
import { AuthService } from "@auth/auth.service";
import { canAccessItem, SIDEBAR_ITEMS } from "@backoffice/layout/sidebar/sidebar-items.config";

export const shopRedirectGuard: CanActivateFn = () => {
  const router = inject(Router);
  const canAccess = canAccessItem(p => inject(AuthService).hasPermission(p));

  const firstRoute = SIDEBAR_ITEMS["shop"]
    .flatMap(s => s.items)
    .flatMap(i => i.children ?? [i])
    .find(i => i.routerLink && canAccess(i));

  return router.createUrlTree([firstRoute?.routerLink ?? "/"]);
};
