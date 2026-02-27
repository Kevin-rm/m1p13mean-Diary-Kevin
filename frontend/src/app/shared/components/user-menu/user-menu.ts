import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  ViewChild,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { Router } from "@angular/router";
import { Avatar } from "primeng/avatar";
import { Menu } from "primeng/menu";
import { ConfirmationService, MenuItem } from "primeng/api";
import { AuthService } from "@auth/auth.service";

@Component({
  selector: "app-user-menu",
  imports: [Avatar, Menu],
  templateUrl: "./user-menu.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserMenu {
  private readonly router = inject(Router);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly authService = inject(AuthService);
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
      accept: () => {
        this.authService
          .logout()
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe(() => {
            this.router.navigate(["/login"]);
          });
      },
    });
  }
}
