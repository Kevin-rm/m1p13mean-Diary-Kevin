import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { RouterLink } from "@angular/router";
import { Button } from "primeng/button";

@Component({
  selector: "app-empty",
  imports: [RouterLink, Button],
  template: `
    <div class="flex flex-col items-center gap-3">
      <div class="flex items-center justify-center size-16 rounded-full bg-surface-100">
        <i class="{{ icon() }} !text-2xl text-muted-color"></i>
      </div>
      <div class="text-center">
        <p class="font-medium">{{ title() }}</p>
        @if (description()) {
          <p class="text-sm text-muted-color mt-1">{{ description() }}</p>
        }
      </div>
      @if (actionLink()) {
        <p-button
          [label]="actionLabel()"
          [routerLink]="actionLink()"
          icon="pi pi-arrow-right"
          iconPos="right"
          [outlined]="true"
          size="small"
        />
      }
    </div>
  `,
  host: { class: "flex justify-center py-20" },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Empty {
  icon = input.required<string>();
  title = input.required<string>();
  description = input<string>();
  actionLink = input<string>();
  actionLabel = input("Découvrir les produits");
}
