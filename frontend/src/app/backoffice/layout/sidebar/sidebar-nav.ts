import { Component, computed, effect, inject, input } from "@angular/core";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { Ripple } from "primeng/ripple";
import { BackofficeNavigation } from "../backoffice-navigation.service";
import { SIDEBAR_ITEMS, SidebarItem } from "./sidebar-items.config";

@Component({
  selector: "app-sidebar-nav",
  imports: [RouterLink, RouterLinkActive, Ripple],
  templateUrl: "./sidebar-nav.html",
})
export class SidebarNav {
  private readonly nav = inject(BackofficeNavigation);
  private readonly expandedItems = new Set<string>();

  protected readonly linkActiveOptions = {
    paths: "exact" as const,
    queryParams: "ignored" as const,
    matrixParams: "ignored" as const,
    fragment: "ignored" as const,
  };

  protected readonly sections = computed(() => SIDEBAR_ITEMS[this.nav.activeSection()] ?? []);

  collapsed = input(false);

  constructor() {
    effect(() => {
      const url = this.nav.currentUrl();
      this.expandedItems.clear();
      for (const section of this.sections()) {
        for (const item of section.items) {
          if (item.children?.some(c => url.startsWith(c.routerLink!))) {
            this.expandedItems.add(item.label);
          }
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
