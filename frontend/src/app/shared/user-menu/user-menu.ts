import { Component, inject, input, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { Avatar } from "primeng/avatar";
import { Menu } from "primeng/menu";
import { ConfirmationService, MenuItem } from "primeng/api";
import { AuthService } from "@auth/auth.service";

@Component({
  selector: "app-user-menu",
  imports: [Avatar, Menu],
  templateUrl: "./user-menu.html",
})
export class UserMenu {
  private readonly router = inject(Router);
  private readonly confirmationService = inject(ConfirmationService);

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
        command: () => this.confirmLogout(),
      },
    ];
  }

  protected toggleUserMenu(event: Event): void {
    this.userMenu.toggle(event);
  }

  private confirmLogout(): void {
    this.confirmationService.confirm({
      message: "Voulez-vous vraiment vous déconnecter ?",
      header: "Déconnexion",
      acceptButtonProps: { label: "Se déconnecter", severity: "danger" },
      rejectButtonProps: { label: "Annuler", severity: "secondary", outlined: true },
      accept: () => {
        this.authService.logout().subscribe(() => {
          this.router.navigate(["/login"]);
        });
      },
    });
  }
}
