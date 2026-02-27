import { ChangeDetectionStrategy, Component, computed, inject, output } from "@angular/core";
import { Router } from "@angular/router";
import { Button } from "primeng/button";
import { Breadcrumb } from "primeng/breadcrumb";
import { MenuItem } from "primeng/api";
import { UserMenu } from "@shared/components/user-menu/user-menu";
import { BreadcrumbService } from "../breadcrumb.service";
import { BackofficeNavigation } from "../backoffice-navigation.service";

@Component({
  selector: "app-bo-header",
  imports: [Button, Breadcrumb, UserMenu],
  templateUrl: "./header.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoHeader {
  private readonly router = inject(Router);
  private readonly nav = inject(BackofficeNavigation);
  protected readonly breadcrumb = inject(BreadcrumbService);

  protected readonly home = computed<MenuItem>(() => ({
    icon: "pi pi-home",
    routerLink: this.nav.homeLink(),
  }));

  protected readonly userMenuItems: MenuItem[] = [
    {
      label: "Retour au site",
      icon: "pi pi-home",
      command: () => this.router.navigate(["/"]),
    },
  ];

  menuToggle = output<void>();
}
