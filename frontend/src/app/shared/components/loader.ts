import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "app-loader",
  template: `<i class="pi pi-spin pi-spinner text-muted-color" style="font-size: 2rem"></i>`,
  host: { class: "flex justify-center py-8" },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Loader {}
