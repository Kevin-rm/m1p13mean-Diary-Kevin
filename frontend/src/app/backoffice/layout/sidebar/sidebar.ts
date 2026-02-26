import { Component, inject, input } from "@angular/core";
import { NgClass } from "@angular/common";
import { RouterLink } from "@angular/router";
import { BackofficeNavigation } from "../backoffice-navigation.service";
import { SidebarNav } from "./sidebar-nav";

@Component({
  selector: "app-sidebar",
  imports: [NgClass, RouterLink, SidebarNav],
  templateUrl: "./sidebar.html",
})
export class Sidebar {
  protected readonly nav = inject(BackofficeNavigation);
  collapsed = input(false);
}
