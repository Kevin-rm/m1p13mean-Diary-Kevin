import { Component, inject, ViewChild } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { Menubar } from "primeng/menubar";
import { Button } from "primeng/button";
import { Avatar } from "primeng/avatar";
import { Menu } from "primeng/menu";
import { MenuItem } from "primeng/api";
import { AuthService } from "../../../auth/auth.service";

@Component({
  selector: "app-navbar",
  imports: [RouterLink, Menubar, Button, Avatar, Menu],
  templateUrl: "./navbar.html",
})
export class Navbar {
  private readonly router = inject(Router);

  protected readonly authService = inject(AuthService);
  protected readonly menuItems: MenuItem[] = [
    { label: "Boutiques", routerLink: "/shops" },
    { label: "Produits", routerLink: "/products" },
    { label: "Catégories", routerLink: "/categories" },
  ];
  protected readonly userMenuItems: MenuItem[] = [
    {
      label: "Mon profil",
      icon: "pi pi-user",
      command: () => this.router.navigate(["/profile"]),
    },
    { separator: true },
    {
      label: "Se déconnecter",
      icon: "pi pi-sign-out",
      styleClass: "text-red-500",
      command: () => this.logout(),
    },
  ];

  @ViewChild("userMenu") userMenu!: Menu;

  protected toggleUserMenu(event: Event): void {
    this.userMenu.toggle(event);
  }

  private logout(): void {
    this.authService.logout().subscribe(() => {
      this.router.navigate(["/login"]);
    });
  }
}
