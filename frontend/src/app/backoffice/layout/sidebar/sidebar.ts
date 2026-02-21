import { Component, computed, inject, input, output } from "@angular/core";
import { NgClass } from "@angular/common";
import { Router, NavigationEnd, RouterLink, RouterLinkActive } from "@angular/router";
import { toSignal } from "@angular/core/rxjs-interop";
import { filter, map } from "rxjs";
import { Ripple } from "primeng/ripple";
import { BACKOFFICE_SIDEBAR_ITEMS } from "./sidebar-items.config";

@Component({
  selector: "app-sidebar",
  imports: [NgClass, RouterLink, RouterLinkActive, Ripple],
  templateUrl: "./sidebar.html",
})
export class Sidebar {
  private readonly router = inject(Router);

  private readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map(e => e.urlAfterRedirects),
    ),
    { initialValue: this.router.url },
  );

  private readonly activeSection = computed(() => {
    const match = this.currentUrl().match(/^\/backoffice\/(\w+)/);
    return match?.[1] ?? "";
  });

  protected readonly items = computed(() => BACKOFFICE_SIDEBAR_ITEMS[this.activeSection()] ?? []);

  collapsed = input(false);
  toggle = output<void>();
}
