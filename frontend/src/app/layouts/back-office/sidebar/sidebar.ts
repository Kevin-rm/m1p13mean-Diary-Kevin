import { Component, input, output } from "@angular/core";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { Ripple } from "primeng/ripple";

interface SidebarItem {
  label: string;
  icon: string;
  routerLink: string;
}

@Component({
  selector: "app-sidebar",
  imports: [RouterLink, RouterLinkActive, Ripple],
  templateUrl: "./sidebar.html",
})
export class Sidebar {
  protected readonly items: SidebarItem[] = [
    { label: "Catégories", icon: "pi pi-tags", routerLink: "/admin/categories" },
  ];

  collapsed = input(false);
  toggle = output<void>();
}
