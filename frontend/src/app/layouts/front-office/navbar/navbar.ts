import { Component, computed, inject, ViewChild } from "@angular/core";
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
  protected readonly authService = inject(AuthService);
  protected readonly menuItems: MenuItem[] = [
    { label: "Boutiques", routerLink: "/shops" },
    { label: "Produits", routerLink: "/products" },
    { label: "Catégories", routerLink: "/categories" },
  ];
  private readonly router = inject(Router);

  @ViewChild("userMenu") userMenu!: Menu;

  protected readonly avatarLabel = computed(() => {
    const user = this.authService.user();
    if (!user) return "";
    return (user.firstName[0] + user.lastName[0]).toUpperCase();
  });

  protected readonly fullName = computed(() => {
    const user = this.authService.user();
    if (!user) return "";
    return `${user.firstName} ${user.lastName}`;
  });

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

  protected toggleUserMenu(event: Event): void {
    this.userMenu.toggle(event);
  }

  private logout(): void {
    this.authService.logout().subscribe(() => {
      this.router.navigate(["/login"]);
    });
  }
}
