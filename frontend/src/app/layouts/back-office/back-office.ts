import { Component, signal } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { Drawer } from "primeng/drawer";
import { Sidebar } from "./sidebar/sidebar";
import { BoHeader } from "./header/header";

@Component({
  selector: "app-back-office",
  imports: [RouterOutlet, Drawer, Sidebar, BoHeader],
  templateUrl: "./back-office.html",
})
export class BackOffice {
  protected readonly sidebarCollapsed = signal(false);
  protected readonly mobileSidebarVisible = signal(false);

  protected toggleSidebar(): void {
    this.sidebarCollapsed.update(v => !v);
  }

  protected toggleMobileSidebar(): void {
    this.mobileSidebarVisible.update(v => !v);
  }
}
