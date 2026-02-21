import { Component, inject, input, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { Avatar } from "primeng/avatar";
import { Menu } from "primeng/menu";
import { MenuItem } from "primeng/api";
import { AuthService } from "../../auth/auth.service";

@Component({
  selector: "app-user-menu",
  imports: [Avatar, Menu],
  templateUrl: "./user-menu.html",
})
export class UserMenu {
  private readonly router = inject(Router);

  protected readonly authService = inject(AuthService);

  extraItems = input<MenuItem[]>([]);

  @ViewChild("userMenu") userMenu!: Menu;

  protected get menuItems(): MenuItem[] {
    return [
      ...this.extraItems(),
      { separator: true },
      {
        label: "Se déconnecter",
        icon: "pi pi-sign-out",
        styleClass: "text-red-500",
        command: () => this.logout(),
      },
    ];
  }

  protected toggleUserMenu(event: Event): void {
    this.userMenu.toggle(event);
  }

  private logout(): void {
    this.authService.logout().subscribe(() => {
      this.router.navigate(["/login"]);
    });
  }
}
