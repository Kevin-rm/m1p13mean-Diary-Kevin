import { Component } from "@angular/core";
import { RouterLink } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";

@Component({
  selector: "app-landing",
  imports: [RouterLink, MatButtonModule],
  templateUrl: "./landing.html",
})
export class Landing {}
