import { Component, inject, output, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { Button } from "primeng/button";
import { Avatar } from "primeng/avatar";
import { Menu } from "primeng/menu";
import { MenuItem } from "primeng/api";
import { AuthService } from "../../../auth/auth.service";

@Component({
  selector: "app-bo-header",
  imports: [Button, Avatar, Menu],
  templateUrl: "./header.html",
})
export class BoHeader {
  private readonly router = inject(Router);
  protected readonly authService = inject(AuthService);

  menuToggle = output<void>();

  protected readonly userMenuItems: MenuItem[] = [
    {
      label: "Retour au site",
      icon: "pi pi-home",
      command: () => this.router.navigate(["/"]),
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
