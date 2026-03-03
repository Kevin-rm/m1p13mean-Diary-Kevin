import { computed, Injectable, inject } from "@angular/core";
import { Router, NavigationEnd } from "@angular/router";
import { toSignal } from "@angular/core/rxjs-interop";
import { filter, map } from "rxjs";

@Injectable({ providedIn: "root" })
export class BackofficeNavigation {
  private readonly router = inject(Router);

  readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map(e => e.urlAfterRedirects),
    ),
    { initialValue: this.router.url },
  );

  readonly activeSection = computed(() => {
    const match = this.currentUrl().match(/^\/backoffice\/(\w+)/);
    return match?.[1] ?? "";
  });

  readonly homeLink = computed(() => `/backoffice/${this.activeSection()}`);
}
