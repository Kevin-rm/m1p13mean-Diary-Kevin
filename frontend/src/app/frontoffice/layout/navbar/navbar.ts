import { ChangeDetectionStrategy, Component, computed, inject } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { Menubar } from "primeng/menubar";
import { Badge } from "primeng/badge";
import { Button } from "primeng/button";
import { MenuItem } from "primeng/api";
import { AuthService } from "@auth/auth.service";
import { CartService } from "@core/domains/cart/cart.service";
import { FavoritesService } from "@core/domains/favorites/favorites.service";
import { UserMenu } from "@shared/components/user-menu/user-menu";

@Component({
  selector: "app-navbar",
  imports: [RouterLink, Menubar, Badge, Button, UserMenu],
  templateUrl: "./navbar.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Navbar {
  private readonly router = inject(Router);

  protected readonly authService = inject(AuthService);
  protected readonly cartService = inject(CartService);
  protected readonly favoritesService = inject(FavoritesService);
  protected readonly homeRoute = computed(() =>
    this.authService.isAuthenticated() ? "/home" : "/",
  );
  protected readonly menuItems: MenuItem[] = [
    { label: "Boutiques", routerLink: "/shops" },
    { label: "Produits", routerLink: "/products" },
  ];
  protected readonly userMenuItems = computed<MenuItem[]>(() => [
    {
      label: "Mes commandes",
      icon: "pi pi-shopping-bag",
      command: () => this.router.navigate(["/orders"]),
    },
    { label: "Mon profil", icon: "pi pi-user", command: () => this.router.navigate(["/profile"]) },
    ...(this.authService.hasProfile("customer")
      ? []
      : [
          {
            label: "Accéder au backoffice",
            icon: "pi pi-th-large",
            command: () => this.router.navigate(["/backoffice"]),
          },
        ]),
  ]);
}
