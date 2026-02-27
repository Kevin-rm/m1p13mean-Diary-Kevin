import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "app-products",
  templateUrl: "./products.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Products {}
