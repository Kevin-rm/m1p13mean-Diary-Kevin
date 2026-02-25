import { Component, inject, output } from "@angular/core";
import { Router } from "@angular/router";
import { Button } from "primeng/button";
import { Breadcrumb } from "primeng/breadcrumb";
import { MenuItem } from "primeng/api";
import { UserMenu } from "@shared/components/user-menu/user-menu";
import { BreadcrumbService } from "../breadcrumb.service";

@Component({
  selector: "app-bo-header",
  imports: [Button, Breadcrumb, UserMenu],
  templateUrl: "./header.html",
})
export class BoHeader {
  private readonly router = inject(Router);
  protected readonly breadcrumb = inject(BreadcrumbService);

  protected readonly home: MenuItem = { icon: "pi pi-home" };

  protected readonly userMenuItems: MenuItem[] = [
    {
      label: "Retour au site",
      icon: "pi pi-home",
      command: () => this.router.navigate(["/"]),
    },
  ];

  menuToggle = output<void>();
}
