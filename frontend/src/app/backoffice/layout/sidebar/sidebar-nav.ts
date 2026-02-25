import { Component, computed, effect, inject, input } from "@angular/core";
import { Router, NavigationEnd, RouterLink, RouterLinkActive } from "@angular/router";
import { toSignal } from "@angular/core/rxjs-interop";
import { filter, map } from "rxjs";
import { Ripple } from "primeng/ripple";
import { SIDEBAR_ITEMS, SidebarItem } from "./sidebar-items.config";

@Component({
  selector: "app-sidebar-nav",
  imports: [RouterLink, RouterLinkActive, Ripple],
  templateUrl: "./sidebar-nav.html",
})
export class SidebarNav {
  private readonly router = inject(Router);
  private readonly expandedItems = new Set<string>();

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

  protected readonly items = computed(() => SIDEBAR_ITEMS[this.activeSection()] ?? []);

  collapsed = input(false);

  constructor() {
    effect(() => {
      const url = this.currentUrl();
      for (const item of this.items()) {
        if (item.children?.some(c => url.startsWith(c.routerLink!))) {
          this.expandedItems.add(item.label);
        }
      }
    });
  }

  protected toggle(item: SidebarItem): void {
    if (this.expandedItems.has(item.label)) {
      this.expandedItems.delete(item.label);
    } else {
      this.expandedItems.add(item.label);
    }
  }

  protected isExpanded(item: SidebarItem): boolean {
    return this.expandedItems.has(item.label);
  }
}
