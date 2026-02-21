import { Component, signal } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { Drawer } from "primeng/drawer";
import { Sidebar } from "./sidebar/sidebar";
import { BoHeader } from "./header/header";
import { Footer } from "../../shared/footer/footer";

@Component({
  selector: "app-back-office",
  imports: [RouterOutlet, Drawer, Sidebar, BoHeader, Footer],
  templateUrl: "./back-office.html",
})
export class BackOffice {
  private static readonly SIDEBAR_KEY = "sidebarCollapsed";

  protected readonly sidebarCollapsed = signal(
    localStorage.getItem(BackOffice.SIDEBAR_KEY) === "true",
  );
  protected readonly mobileSidebarVisible = signal(false);

  protected toggleSidebar(): void {
    this.sidebarCollapsed.update(v => {
      localStorage.setItem(BackOffice.SIDEBAR_KEY, String(!v));
      return !v;
    });
  }
}
