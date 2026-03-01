import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  ViewChild,
} from "@angular/core";
import { Router } from "@angular/router";
import { lastValueFrom } from "rxjs";
import { injectMutation } from "@tanstack/angular-query-experimental";
import { Menu } from "primeng/menu";
import { UserAvatar } from "@shared/components/user-avatar";
import { ConfirmationService, MenuItem } from "primeng/api";
import { AuthService } from "@auth/auth.service";

@Component({
  selector: "app-user-menu",
  imports: [Menu, UserAvatar],
  templateUrl: "./user-menu.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserMenu {
  private readonly router = inject(Router);
  private readonly confirmationService = inject(ConfirmationService);

  protected readonly authService = inject(AuthService);
  protected readonly logoutMutation = injectMutation(() => ({
    mutationFn: () => lastValueFrom(this.authService.logout()),
    onSuccess: () => {
      this.router.navigate(["/login"]);
    },
  }));
  protected readonly menuItems = computed<MenuItem[]>(() => [
    ...this.extraItems(),
    { separator: true },
    {
      label: "Se déconnecter",
      icon: "pi pi-sign-out",
      styleClass: "text-red-500",
      command: () => this.confirmLogout(),
    },
  ]);

  extraItems = input<MenuItem[]>([]);

  @ViewChild("userMenu") userMenu!: Menu;

  protected toggleUserMenu(event: Event): void {
    this.userMenu.toggle(event);
  }

  private confirmLogout(): void {
    this.confirmationService.confirm({
      message: "Voulez-vous vraiment vous déconnecter ?",
      header: "Déconnexion",
      acceptButtonProps: { label: "Se déconnecter", severity: "danger" },
      rejectButtonProps: { label: "Annuler", severity: "secondary", outlined: true },
      accept: () => this.logoutMutation.mutate(),
    });
  }
}
