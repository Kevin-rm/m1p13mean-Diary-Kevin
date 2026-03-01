import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from "@angular/core";
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
  private readonly expandedItems = signal(new Set<string>());
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

  protected readonly expanded = computed(() => {
    const url = this.nav.currentUrl();
    const manual = this.expandedItems();
    const labels = new Set(manual);
    for (const section of this.sections()) {
      for (const item of section.items) {
        if (item.children?.some(c => url.startsWith(c.routerLink!))) {
          labels.add(item.label);
        }
      }
    }
    return labels;
  });

  collapsed = input(false);

  protected toggle(item: SidebarItem): void {
    this.expandedItems.update(set => {
      const next = new Set(set);
      if (next.has(item.label)) next.delete(item.label);
      else next.add(item.label);
      return next;
    });
  }

  protected isExpanded(item: SidebarItem): boolean {
    return this.expanded().has(item.label);
  }
}
