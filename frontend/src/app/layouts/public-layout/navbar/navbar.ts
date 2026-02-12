import { Component, inject } from "@angular/core";
import { RouterLink } from "@angular/router";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatButtonModule } from "@angular/material/button";
import { AuthService } from "../../../auth/auth.service";

@Component({
  selector: "app-navbar",
  imports: [RouterLink, MatToolbarModule, MatButtonModule],
  templateUrl: "./navbar.html",
})
export class Navbar {
  protected readonly authService = inject(AuthService);
}
