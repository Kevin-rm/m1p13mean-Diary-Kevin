import { ChangeDetectionStrategy, Component, inject, input } from "@angular/core";
import { Location } from "@angular/common";
import { Button } from "primeng/button";

@Component({
  selector: "app-page-header",
  imports: [Button],
  template: `
    <div class="flex items-center gap-3 mb-6">
      @if (back()) {
        <p-button
          icon="pi pi-arrow-left"
          [text]="true"
          [rounded]="true"
          severity="secondary"
          (click)="goBack()"
        />
      }
      <h1 class="text-2xl font-semibold m-0 flex-1">{{ title() }}</h1>
      <ng-content />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageHeader {
  private readonly location = inject(Location);

  title = input.required<string>();
  back = input(false);

  protected goBack(): void {
    this.location.back();
  }
}
