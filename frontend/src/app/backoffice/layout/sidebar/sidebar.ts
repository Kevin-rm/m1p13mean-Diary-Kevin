import { Component, input } from "@angular/core";
import { NgClass } from "@angular/common";
import { RouterLink } from "@angular/router";
import { SidebarNav } from "./sidebar-nav";

@Component({
  selector: "app-sidebar",
  imports: [NgClass, RouterLink, SidebarNav],
  templateUrl: "./sidebar.html",
})
export class Sidebar {
  collapsed = input(false);
}
