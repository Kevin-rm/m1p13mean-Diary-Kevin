import { ChangeDetectionStrategy, Component, computed, effect, inject, input } from "@angular/core";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { Ripple } from "primeng/ripple";
import { AuthService } from "@auth/auth.service";
import { BackofficeNavigation } from "../backoffice-navigation.service";
import { canAccessItem, SIDEBAR_ITEMS, SidebarItem } from "./sidebar-items.config";

@Component({
  selector: "app-sidebar-nav",
  imports: [RouterLink, RouterLinkActive, Ripple],
  templateUrl: "./sidebar-nav.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarNav {
  private readonly authService = inject(AuthService);
  private readonly nav = inject(BackofficeNavigation);
  private readonly expandedItems = new Set<string>();
  private readonly canAccess = canAccessItem(p => this.authService.hasPermission(p));

  protected readonly linkActiveOptions = {
    paths: "exact" as const,
    queryParams: "ignored" as const,
    matrixParams: "ignored" as const,
    fragment: "ignored" as const,
  };

  protected readonly sections = computed(() =>
    (SIDEBAR_ITEMS[this.nav.activeSection()] ?? [])
      .map(s => ({
        ...s,
        items: s.items
          .filter(this.canAccess)
          .map(i => (i.children ? { ...i, children: i.children.filter(this.canAccess) } : i))
          .filter(i => !i.children || i.children.length > 0),
      }))
      .filter(s => s.items.length > 0),
  );

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
