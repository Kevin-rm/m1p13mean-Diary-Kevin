import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "app-categories",
  templateUrl: "./categories.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Categories {}
