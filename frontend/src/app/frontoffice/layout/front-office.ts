import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { Navbar } from "./navbar/navbar";
import { Footer } from "@shared/footer/footer";

@Component({
  selector: "app-front-office",
  imports: [RouterOutlet, Navbar, Footer],
  templateUrl: "./front-office.html",
})
export class FrontOffice {}
