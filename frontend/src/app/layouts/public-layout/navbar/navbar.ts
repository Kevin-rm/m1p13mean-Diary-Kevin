import { Component, inject } from "@angular/core";
import { RouterLink } from "@angular/router";
import { Menubar } from "primeng/menubar";
import { Button } from "primeng/button";
import { AuthService } from "../../../auth/auth.service";

@Component({
  selector: "app-navbar",
  imports: [RouterLink, Menubar, Button],
  templateUrl: "./navbar.html",
})
export class Navbar {
  protected readonly authService = inject(AuthService);
  protected readonly menuItems: never[] = [];
}
