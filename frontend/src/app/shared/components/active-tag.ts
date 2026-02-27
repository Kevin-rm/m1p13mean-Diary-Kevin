import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { Tag } from "primeng/tag";

@Component({
  selector: "app-active-tag",
  imports: [Tag],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<p-tag
    [value]="isActive() ? 'Actif' : 'Inactif'"
    [severity]="isActive() ? 'success' : 'danger'"
  />`,
})
export class ActiveTag {
  readonly isActive = input.required<boolean>();
}
