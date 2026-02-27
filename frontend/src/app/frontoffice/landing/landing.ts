import { ChangeDetectionStrategy, Component } from "@angular/core";
import { RouterLink } from "@angular/router";
import { Button } from "primeng/button";

@Component({
  selector: "app-landing",
  imports: [RouterLink, Button],
  templateUrl: "./landing.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Landing {}
