import { Component, inject, output } from "@angular/core";
import { Router } from "@angular/router";
import { Button } from "primeng/button";
import { MenuItem } from "primeng/api";
import { UserMenu } from "@shared/components/user-menu/user-menu";

@Component({
  selector: "app-bo-header",
  imports: [Button, UserMenu],
  templateUrl: "./header.html",
})
export class BoHeader {
  private readonly router = inject(Router);

  protected readonly userMenuItems: MenuItem[] = [
    {
      label: "Retour au site",
      icon: "pi pi-home",
      command: () => this.router.navigate(["/"]),
    },
  ];

  menuToggle = output<void>();
}
