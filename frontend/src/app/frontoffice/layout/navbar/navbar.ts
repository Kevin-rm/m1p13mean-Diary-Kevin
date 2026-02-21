import { Component, inject } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { Menubar } from "primeng/menubar";
import { Button } from "primeng/button";
import { MenuItem } from "primeng/api";
import { AuthService } from "../../../auth/auth.service";
import { UserMenu } from "../../../shared/user-menu/user-menu";

@Component({
  selector: "app-navbar",
  imports: [RouterLink, Menubar, Button, UserMenu],
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
  ];
}
