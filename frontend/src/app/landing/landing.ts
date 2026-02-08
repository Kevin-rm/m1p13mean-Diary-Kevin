import { Component } from "@angular/core";
import { RouterLink } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";
import { Navbar } from "../shared/components/navbar/navbar";

@Component({
  selector: "app-landing",
  imports: [RouterLink, MatButtonModule, Navbar],
  templateUrl: "./landing.html",
})
export class Landing {}
